import { type } from "os";

export default function Home() {
  return (
    <main className="w-1/2 h-[600px] bg-slate-100 p-4 text-black rounded-sm m-auto flex items-center justify-center">
      <div className="border border-gray-300 p-6 w-[50%] h-[70%] bg-gray-300 rounded-md">
        <h2 className="text-center text-xl mb-4 font-bold">Login</h2>
        <form className="flex flex-col space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1">Email:</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-gray-400 rounded"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">Password:</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border border-gray-400 rounded"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  );
}

