// The frontend was originally built against localStorage "documents" that
// look like { id: "post123", postedAt: 1715000000000, ... } — plain string
// ids and epoch-millisecond numbers, not Mongo's { _id, createdAt: ISOString }.
//
// Rather than rewrite the frontend's sort/compare logic (e.g. `b.time - a.time`),
// every model applies this plugin so the API keeps returning data in the
// exact shape the UI already expects:
//   - `_id`            -> `id` (string)
//   - `createdAt`       -> `createdAt` as epoch ms (number)
//   - `updatedAt`, `__v` -> removed from the response
export default function toJSONPlugin(schema, options = {}) {
  const extraTimeFields = options.timeFields || [];

  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform(_doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;

      if (ret.createdAt instanceof Date) ret.createdAt = ret.createdAt.getTime();
      if (ret.updatedAt instanceof Date) delete ret.updatedAt;

      extraTimeFields.forEach((field) => {
        if (ret[field] instanceof Date) ret[field] = ret[field].getTime();
      });

      if (typeof options.afterTransform === "function") {
        options.afterTransform(_doc, ret);
      }

      return ret;
    },
  });
}
