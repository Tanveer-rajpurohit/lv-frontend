import ProfileCompletionClient from "../../components/features/auth/ProfileCompletion.client";
import { AuthProvider } from "../../hooks/useAuth";

export default function ProfileCompletionPage() {
  return (
    <AuthProvider>
      <ProfileCompletionClient />
    </AuthProvider>
  );
}
