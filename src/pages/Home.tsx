import { Link } from "react-router-dom";
import { Library, Users, ShieldCheck, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";



function  Home(){
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Library className="h-5 w-5" />
            </div>
            <span className="font-semibold">LibraryHub</span>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="ghost"><Link to="/login/student">Student Login</Link></Button>
            <Button asChild><Link to="/login/admin">Admin Login</Link></Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground mb-6">
          <ShieldCheck className="h-3.5 w-3.5" /> Final Year Project 2026
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Smart <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Library Management</span> System
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
         A modern web-based Library Management System for managing books, students, categories, and book borrowing with separate admin and student portals.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg"><Link to="/login/admin">Enter Admin Panel <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          <Button asChild size="lg" variant="outline"><Link to="/login/student">Student Portal</Link></Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 grid gap-6 sm:grid-cols-3">
        {[
          { icon: BookOpen, title: "Book Catalog", desc: "Add, update, organize, and search books while tracking their availability in the library." },
          { icon: Users, title: "Student Records", desc: "Manage student information, monitor borrowing history, and maintain library membership records." },
          { icon: ShieldCheck, title: "Issue & Return", desc: "Issue books to students, process returns, and automatically update book availability." },
        ].map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="p-6">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{desc}</p>
          </Card>
        ))}
      </section>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        LibraryHub – Smart Library Management System
      </footer>
    </div>
  );
}

export default Home;
