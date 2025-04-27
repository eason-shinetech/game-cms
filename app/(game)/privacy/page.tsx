const PrivacyPage = () => {
  return (
    <div className="w-full flex flex-col items-start justify-center text-sm text-slate-500 p-4 gap-4">
      <h2 className="text-2xl font-semibold">Privacy Policy</h2>
      <p>
        Welcome to Funny Games! We prioritize your privacy and are committed to
        safeguarding any personal information you provide. This Privacy Policy
        outlines how we collect, use, and protect your data when you interact
        with our website, services, and tools. By using Funny Games, you consent
        to the practices outlined in this policy.
      </p>
      <h3 className="text-md font-semibold">1. Information We Collect</h3>
      <p>
        <strong>Usage Data: </strong>Data collected automatically, such as your
        IP address, browser type, device information, and pages visited on Funny
        Games. This helps us understand how users interact with our site and
        improve our services.
      </p>
      <p>
        <strong>Cookies and Tracking Technologies: </strong>We use cookies,
        beacons, and other technologies to enhance your experience, track
        website performance, and analyze user behavior.
      </p>
      <h3 className="text-md font-semibold">2. How We Use Your Information</h3>
      <ul>
        <li>Improve website functionality and optimize user experience. </li>
        <li>Provide personalized content and recommendations.</li>
        <li>
          Communicate with you regarding updates, promotions, or customer
          support inquiries.
        </li>
        <li>
          Monitor website analytics and user trends to enhance our services.
        </li>
        <li>
          Ensure compliance with our terms, policies, and legal requirements.
        </li>
      </ul>
      <h3 className="text-md font-semibold">3. Data Sharing and Disclosure</h3>
      <p>
        We value your privacy and do not sell or rent your personal information.
      </p>
      <h3 className="text-md font-semibold">4. Security of Your Information</h3>
      <p>
        We implement security measures designed to protect your personal
        information from unauthorized access, alteration, or disclosure.
        However, please understand that no method of transmission over the
        internet or electronic storage is completely secure.
      </p>
    </div>
  );
};

export default PrivacyPage;
