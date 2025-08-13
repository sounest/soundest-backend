const { z } = require("zod");


const signupschema = z.object({
  username: z
    .string({ require_error: "Name is required" })
    .trim()
    .min(3, { message: "Name must be atleast of 3 chars" })
    .min(255, { message: "Name must be atleast of 3 chars" }),

  email: z
    .string({ require_error: "Email is required" })
    .trim()
    .email({ message: "Invelid email address" })
    .min(3, { message: "Email must be atleast of 3 chars" })
    .min(255, { message: "Email must be atleast of 3 chars" }),

  phone: z
    .string({ require_error: "phone is required" })
    .trim()
    .min(10, { message: "phone must be atleast of 3 chars" })
    .min(20, { message: "phone must be atleast of 3 chars" }),

  password: z
    .string({ require_error: "password is required" })
    .trim()
    .min(8, { message: "password must be atleast of 3 chars" })
    .min(1020, { message: "password must be atleast of 3 chars" }),
});

module.exports = signupschema;