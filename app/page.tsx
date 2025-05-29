"use client";

import { Button } from "@/components/ui/button";
import {
  Target,
  Users,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLHeadingElement | null>(null);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const animateElements = () => {
      // Header animation
      if (headerRef.current) {
        const header = headerRef.current;
        header.style.opacity = "0";
        header.style.transform = "translateY(-20px)";
        setTimeout(() => {
          header.style.transition = "all 0.8s ease-out";
          header.style.opacity = "1";
          header.style.transform = "translateY(0)";
        }, 100);
      }

      // Hero animation
      if (heroRef.current) {
        const elements = Array.from(heroRef.current.children) as HTMLElement[];
        elements.forEach((el, index) => {
          el.style.opacity = "0";
          el.style.transform = "translateY(30px)";
          setTimeout(() => {
            el.style.transition = "all 0.8s ease-out";
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }, 200 + index * 200);
        });
      }

      // Features animation
      if (featuresRef.current) {
        const cards =
          featuresRef.current.querySelectorAll<HTMLElement>(".feature-card");
        cards.forEach((card, index) => {
          card.style.opacity = "0";
          card.style.transform = "translateY(40px) scale(0.95)";
          setTimeout(() => {
            card.style.transition = "all 0.6s ease-out";
            card.style.opacity = "1";
            card.style.transform = "translateY(0) scale(1)";
          }, 600 + index * 150);
        });
      }
    };

    animateElements();
  }, []);

  const handleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-blue-600/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Header */}
      <header
        ref={headerRef}
        className="relative z-10 flex items-center justify-between p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-b border-blue-100/50 dark:border-gray-700/50"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            MyOKR
          </h1>
        </div>
        <div className="space-x-4">
          {status === "authenticated" ? (
            <>
              <Button
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </Button>
              <Button
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20"
              >
                Learn More
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={handleSignIn}
              >
                <span className="flex items-center space-x-2">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-br from-gray-50 via-blue-25 to-gray-100 dark:from-gray-900 dark:via-blue-950/20 dark:to-gray-800">
        <div ref={heroRef} className="max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-blue-200/50 dark:border-blue-800/50">
            <Star className="w-4 h-4" />
            <span>Trusted by 10,000+ teams worldwide</span>
          </div>

          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent leading-tight">
            Empower Your Team with
            <span className="block bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Clear Goals
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mb-8 leading-relaxed">
            MyOKR helps you set, track, and achieve ambitious goals at every
            level — from company-wide OKRs to individual contributions.
            Transform your vision into measurable results.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
              onClick={handleSignIn}
            >
              <span className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/20 px-8 py-4 text-lg transition-all duration-300"
            >
              Watch Demo
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-20 px-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-blue-100/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
              Everything you need to succeed
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to help your team align, track
              progress, and achieve extraordinary results.
            </p>
          </div>

          <div
            ref={featuresRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Target,
                title: "Organization OKRs",
                description:
                  "Align your organization with top-level objectives and strategic initiatives.",
                gradient: "from-blue-500 to-blue-600",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description:
                  "Foster goal alignment across teams and departments with seamless collaboration.",
                gradient: "from-blue-600 to-indigo-600",
              },
              {
                icon: BarChart3,
                title: "Progress Analytics",
                description:
                  "Visualize how your team is tracking with powerful analytics and insights.",
                gradient: "from-indigo-600 to-purple-600",
              },
              {
                icon: CheckCircle,
                title: "Simple Tracking",
                description:
                  "Easy-to-use dashboards to monitor progress and celebrate achievements.",
                gradient: "from-purple-600 to-blue-600",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="feature-card group p-8 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl border border-blue-100/50 dark:border-blue-800/30 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {feature.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to transform your team&apos;s performance?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful teams already using MyOKR to achieve
            their most ambitious goals.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105"
            onClick={handleSignIn}
          >
            <span className="flex items-center space-x-2">
              <span>Start Your Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </span>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 p-8 text-center bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-blue-100/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              MyOKR
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} MyOKR. All rights reserved. Empowering
            teams to achieve extraordinary results.
          </p>
        </div>
      </footer>
    </div>
  );
}
