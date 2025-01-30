import UpdatePassword from "../components/updatePassword";

export default function User() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Mon profil</h1>
      <UpdatePassword />
    </div>
  );
}
