import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import ConversationList from "../components/chat/ConversationList";
import ChatWindow from "../components/chat/ChatWindow";
import GroupMembersList from "../components/groups/GroupMembersList";
import { getGroups, getGroupMessages, sendGroupMessage } from "../services/groupService";
import { getConversations, startConversation, getMessages, sendMessage } from "../services/chatService";
import { getCurrentUserId } from "../utils/currentUser";

export default function Chat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [groups, setGroups] = useState([]);
  const [privateConversations, setPrivateConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messagesByConversation, setMessagesByConversation] = useState({});
  const [membersOpen, setMembersOpen] = useState(false);
  const [mobileListVisible, setMobileListVisible] = useState(true);

  const groupParam = searchParams.get("group");
  const userParam = searchParams.get("user");

  const loadGroups = async () => {
    const allGroups = await getGroups();
    const myId = getCurrentUserId();
    setGroups(allGroups.filter((g) => g.members.includes(myId)));
  };

  const loadPrivateConversations = async () => {
    const rows = await getConversations();
    setPrivateConversations(rows);
    return rows;
  };

  useEffect(() => {
    loadGroups();
    loadPrivateConversations();
  }, []);

  // Deep link support: /chat?group=<id> or /chat?user=<id>
  useEffect(() => {
    if (groupParam) {
      setActiveId(`group-${groupParam}`);
      setMobileListVisible(false);
      setSearchParams({}, { replace: true });
    } else if (userParam) {
      startConversation(userParam).then(async (convo) => {
        await loadPrivateConversations();
        setActiveId(convo.id);
        setMobileListVisible(false);
        setSearchParams({}, { replace: true });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupParam, userParam]);

  const conversations = useMemo(() => {
    const groupRows = groups.map((g) => ({
      id: `group-${g.id}`,
      isGroup: true,
      groupId: g.id,
      name: g.name,
      memberCount: g.members.length,
      lastMessage: "Tap to view group chat",
      time: "",
      unread: 0,
    }));
    return [...groupRows, ...privateConversations];
  }, [groups, privateConversations]);

  const activeConversation = conversations.find((c) => c.id === activeId) || null;
  const activeMessages = messagesByConversation[activeId] || [];

  const loadMessages = useCallback(async (conversation) => {
    if (!conversation) return;
    const data = conversation.isGroup
      ? await getGroupMessages(conversation.groupId)
      : await getMessages(conversation.id);
    setMessagesByConversation((prev) => ({ ...prev, [conversation.id]: data }));
  }, []);

  useEffect(() => {
    if (!activeConversation) return;
    loadMessages(activeConversation);

    // Live update polling for concurrent users
    const interval = setInterval(() => {
      loadMessages(activeConversation);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeConversation, loadMessages]);

  const handleSelect = (id) => {
    setActiveId(id);
    setMobileListVisible(false);
  };

  const handleSend = async (text) => {
    if (!activeConversation) return;
    if (activeConversation.isGroup) {
      const message = await sendGroupMessage(activeConversation.groupId, text);
      setMessagesByConversation((prev) => ({
        ...prev,
        [activeConversation.id]: [...(prev[activeConversation.id] || []), { ...message, isOwn: true }],
      }));
    } else {
      const message = await sendMessage(activeConversation.id, { text });
      setMessagesByConversation((prev) => ({
        ...prev,
        [activeConversation.id]: [...(prev[activeConversation.id] || []), message],
      }));
      await loadPrivateConversations();
    }
  };

  const handleViewMembers = () => {
    if (!activeConversation?.isGroup) return;
    setMembersOpen(true);
  };

  const activeGroup = activeConversation?.isGroup
    ? groups.find((g) => g.id === activeConversation.groupId)
    : null;

  return (
    <PageLayout>
      <div className="flex h-[calc(100vh-64px)] rounded-3xl overflow-hidden card-surface">
        <div className={`w-full sm:w-80 border-r border-outline-variant/20 shrink-0 ${mobileListVisible ? "block" : "hidden"} sm:block`}>
          <ConversationList conversations={conversations} activeId={activeId} onSelect={handleSelect} />
        </div>
        <div className={`flex-1 flex-col ${mobileListVisible ? "hidden" : "flex"} sm:flex`}>
          <ChatWindow
            conversation={activeConversation}
            messages={activeMessages}
            onSend={handleSend}
            onViewMembers={handleViewMembers}
            onBack={() => setMobileListVisible(true)}
          />
        </div>
      </div>

      <GroupMembersList group={activeGroup} open={membersOpen} onClose={() => setMembersOpen(false)} />
    </PageLayout>
  );
}
