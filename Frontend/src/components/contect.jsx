// Contact Page Component
export default function Contect() {
  return (
    <section className="bg-black text-white min-h-screen w-full flex items-center">
      <div className="max-w-4xl mx-auto px-4 py-12 w-full">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-8">
          Contact Me
        </h2>

        <form className="space-y-6">
          <div>
            <label className="block mb-2 text-gray-300">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-300">Message</label>
            <textarea
              rows="5"
              placeholder="Enter your message"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:border-white"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
