import { z } from "zod";
import { IPV4_REGEX } from "@lib/constants";
import { isBetween, isPrivateIP } from "@lib/utils";
import { ZodErrorMap } from "zod/lib/ZodError";

export const NameSchema = z
   .string()
   .nonempty()
   .refine((v) => v.length < 32, {
     message: 'Name must be less than 32 characters'
   })
   .refine((v) => v.match(/^[a-zA-Z0-9-_]+$/), {
     message: 'Name must only contain alphanumeric characters, dashes, and underscores'
   })

export const AddressSchema = z
   .string()
   .nonempty()
   .refine((v) => isPrivateIP(v), {
     message: 'Address must be a private IP address'
   })

export const PortSchema = z
   .string()
   .nonempty()
   .refine((v) => {
     const port = parseInt(v)
     return port > 0 && port < 65535
   }, {
     message: 'Port must be a valid port number'
   })

export const TypeSchema = z.enum([ 'default', 'tor' ])

export const DnsSchema = z
   .string()
   .regex(IPV4_REGEX, {
     message: 'DNS must be a valid IPv4 address'
   })
   .optional()

export const MtuSchema = z
   .string()
   .refine((d) => isBetween(d, 1, 1500), {
     message: 'MTU must be between 1 and 1500'
   })
   .optional()

export const ServerId = z
   .string()
   .uuid({ message: 'Server ID must be a valid UUID' })

export const ServerStatusSchema = z
   .enum([ 'up', 'down' ], {
     errorMap: issue => {
       switch (issue.code) {
         case 'invalid_type':
         case 'invalid_enum_value':
           return { message: 'Status must be either "up" or "down"' }
         default:
           return { message: 'Invalid status' }
       }
     }
   })
