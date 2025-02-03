function Footer() {
    return (
      <footer className="bg-muted mt-auto py-4">
        <div className="container mx-auto text-center text-muted-foreground">
          © {new Date().getFullYear()} Shrunk. All rights reserved.
        </div>
      </footer>
    );
  };
  
  export default Footer;  