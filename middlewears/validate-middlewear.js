// const validate = (Schema) => async (req, res, next) => {
//   try {
//     const parsedBody = await Schema.parseAsync(req.body);
//     req.body = parsedBody;
//     next();
//   } catch (err) {
//     const status = 422;
//     const message = "Fill the input properly";
//     const extraDetails = err.errors?.[0]?.message || "Validation error";

//     const error = {
//       status,
//       message,
//       extraDetails,
//     };

//     console.log("Validation Error:", error);
//     next(error);
//   }
// };

// module.exports = validate;
