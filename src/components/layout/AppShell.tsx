
import { ReactNode, useState } from 'react';
import Navbar from './Navbar';
import { Toaster } from "sonner";
import { motion } from "framer-motion";

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 container mx-auto px-4 py-4"
      >
        {children}
      </motion.main>
      <Toaster position="top-center" />
    </div>
  );
};

export default AppShell;
