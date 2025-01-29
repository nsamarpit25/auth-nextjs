export default function UserProfile({ params }) {
   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
         User Profile: {params.id}
      </div>
   );
}
