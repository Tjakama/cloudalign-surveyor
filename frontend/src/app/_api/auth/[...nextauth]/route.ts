import NextAuth from "next-auth"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "development-secret-key-change-in-production",
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
      // @ts-ignore
      tenantId: process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID!,
    }),
  ],
})

export { handler as GET, handler as POST }