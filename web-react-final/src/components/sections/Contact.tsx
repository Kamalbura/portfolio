'use client';

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-6">
            Let&apos;s Connect
          </h2>
          <div className="w-20 h-px bg-gray-900 dark:bg-white mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            I&apos;m always open to discussing new opportunities, interesting projects, or just having a chat about technology.
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* Email */}
          <a
            href="mailto:kamal.bura@vasavi.edu"
            className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg hover:shadow-lg transition-all duration-300 group"
          >
            <div className="text-3xl mb-4">📧</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
            <p className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              kamal.bura@vasavi.edu
            </p>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/in/kamalbura"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg hover:shadow-lg transition-all duration-300 group"
          >
            <div className="text-3xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">LinkedIn</h3>
            <p className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Connect professionally
            </p>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/kamalbura"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg hover:shadow-lg transition-all duration-300 group"
          >
            <div className="text-3xl mb-4">💻</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">GitHub</h3>
            <p className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              View my code
            </p>
          </a>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Ready to build something amazing together?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Whether you have a project in mind, want to discuss opportunities, or just want to say hello, I&apos;d love to hear from you.
          </p>
          <a
            href="mailto:kamal.bura@vasavi.edu?subject=Let's%20Connect&body=Hi%20Kamal,%0A%0AI%20found%20your%20portfolio%20and%20would%20like%20to%20connect..."
            className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Send Message
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
