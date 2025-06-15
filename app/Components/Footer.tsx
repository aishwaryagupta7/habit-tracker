

const Footer = () => {
  return (
      <footer className="w-full bg-gray-900 text-white py-4 px-6 mt-8">
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <span>&copy; {new Date().getFullYear()} HabitSync. All rights reserved.</span>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    );
}

export default Footer