import { useNavigate } from "react-router-dom";
// import { Button } from "./components/Button";
// import Storage from "./icons/Storage";
// import { Analyze } from "./icons/Analyze";
// import { Discuss } from "./icons/Discuss";
// import { Accessed } from "./icons/Accessed";
// import { Recieve } from "./icons/Recieve";
// import { Search } from "./icons/Searrch";
// import { Send } from "./icons/Send";   
import { NavBar } from "../New-components/NavBar";  

export function Privacy() { 
  const navigate = useNavigate();
  const handleUserClick = () => { 
    navigate('/user/portal/signup');
  };

  // const handleDoctorClick = () => {
  //   navigate('/doctors/signup');
  // }; 
  return <div >
     
    <div id="NEW INTERFACE">
      <div className=" fixed w-full z-50 top-0 left-0 right-0">
        <NavBar />
      </div>
      <div className=" mt-24 ml-16 sm:md36 md:ml-96">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1175 263" fill="black" className="abs hero-backgroundImage top right primary-3"><path d="M470 96.1505C285.24 111.849 142.033 74.7745 0 0H1175V263C862.527 210.142 1128.96 40.1598 470 96.1505Z" fill="#831a4a"></path></svg>
      </div>
      <div id="MAIN_CONTENT" className="">
      <div className=" px-10 py-8 -mt-40">
    <div className="container--m">
        <div>
            <p>
                <span className="bg-primary-3 mono ss14 sm16 caps px1 py05 br5 cw">Last Updated 10/23/23
                </span>
            </p>
            <h2 className="mb-20 mt-2 font-bold text-4xl">Swasthlekh, Inc. Privacy Policy
            </h2>
            <p>
                This “Privacy Policy” governs your use of the swasthlekh (“swasthlekh” or “Company” or “we” or “us”) websites and all features, tools, content, downloads and other services (“Services”) that we make available through those websites (collectively, referred to herein as the “Platform”).
            </p>
            <p>
                If we provide you notice of a different privacy policy for a different service, this Privacy Policy will not apply. This Privacy Policy also does not apply to information collected by us offline, or collected by any third party, including through any application or content (including advertising) that may link to or be accessible from or our websites.
            </p>
            <p>
                swasthlekh is not a medical group or a health care provider. swasthlekh contracts with affiliated medical groups (collectively defined as “Medical Groups”), to provide online telehealth, in person medical consultations and secure messaging between Medical Groups’ providers (each a “Provider” and collectively “Providers”) and their patients. Any telehealth consultations through the Platform are provided by independent medical practitioners in Medical Group. Medical Groups or Providers are responsible for providing you with a HIPAA Notice of Privacy Practices describing their collection and use of your health information.
            </p>
            <p>
                By using our Platform you consent to our Privacy Policy and our collection, use and sharing of your information and data, and other activities, as described below. If you do not agree to be bound by those terms, you are not authorized to access or use the Platform, and you must promptly exit the Platform. If we make any changes to our Privacy Policy, we will post the revised Privacy Policy and update the "Last updated" date of the Privacy Policy.
            </p>
            <p>
                Our Platform and Services are not intended for children under the age of 18.&nbsp; If you are under the age of 18, please do not access our Platform.&nbsp; If we learn that we have inadvertently collected personal information from someone under the age of 13, we will promptly delete that information. If you believe we have collected personal information from someone under the age of 13, please contact us using the contact information at the end of this privacy policy.
            </p>
            <h3 className="mt05 mb20 mt20">1. What Information Does the Platform Collect?
            </h3>
            <p>
                On the Platform, we may ask you to provide certain categories of information such as:
            </p>
            <ul>
                <li>
                    Personally identifying information (such as your name, e-mail address, phone number, and billing and physical addresses (“PII”);
                </li>
                <li>
                    Your login, user ID, password, password hints, and similar security information use for authentication and account access;
                </li>
                <li>
                    Demographic data (such as your gender, date of birth and zip code (“Personal Demographic Information”));
                </li>
                <li>
                    Information about your health (such as your medical history or&nbsp; information about your menstrual cycle) and information about the medications you are taking (such as your current and past birth control methods) (“Health Information”);
                </li>
                <li>
                    Your health insurance information;
                </li>
                <li>
                    Computer, mobile device and/or browser information (such as your IP address, mobile device ID information, operating system, language preferences, referring URLS, location, connection speed, bandwidth, browser type, referring/exist web pages, web page requests, cookie information, hardware attributes, software attributes);
                </li>
                <li>
                    Third-party website, network, platform, server and/or application information (such as Facebook, Twitter, Instagram);
                </li>
                <li>
                    Usage activity concerning your interactions with the Platform and/or third-party websites, networks or applications accessed through the Platform (such as viewing habits, viewing preferences, viewing history, number of clicks on a page or feature, amount of time spent on a page or feature, identity of third-party websites, networks, etc.);
                </li>
                <li>
                    Billing, payment and shipping information, such as credit card number, the security code associated with your payment instrument, purchase history, and invoices;
                </li>
                <li>
                    Electronic signatures;
                </li>
                <li>
                    Photographic or video images submitted for identification or non-diagnosis or treatment purposes;
                </li>
                <li>
                    Information about third parties that you refer to us (such as name, email, and/or other contact information, relationship);
                </li>
                <li>
                    Statements or content (such as comments, videos, photographs, images) and information about such statements or content, which you submit or publish on or through the Platform or which are accessed via your public or linked social media pages (e.g., Facebook, Twitter, Instagram); and
                </li>
                <li>
                    Any other information you provide when you contact or communicate with us including: 1) forms filled out by a user on the Platform; 2) information provided by a user in connection with any services offered on the Platform; and 3) surveys, polls, blogs and postings and submissions.
                </li>
            </ul>
            <p>
                “PII”, “Personal Demographic Information” and “Health Information” are referred to in this Privacy Policy as “Your Information.”
            </p>
           
</div>
</div>
</div>
        <div id="NINTH ELEMENT" className=" bg-stone-800 text-white py-28 pt-28">
          <div className=" flex justify-between px-8 md:px-32 py-4">
            <div className=" ">
              <div className=" flex text-4xl md:text-4xl lg:text-5xl max-w-lg lg:max-w-2xl">
              Connected care, reimagined & tailored to you
              </div>
              
              <div className="flex mt-20">
                <div className=" ">
                <button onClick={handleUserClick} className="btn flex rounded-full px-4 md:px-10 py-4 text-xs sm:text-sm md:text-md font-bold hover:bg-pink-500 transition-colors duration-700  text-black">Join now</button>
                </div>
                <div className=" mx-4 md:mx-6">
                <button className=" bg-transparent rounded-full border-2 hover:text-gray-500 border-whiterounded-full px-5 sm:px-7 md:px-10 py-4 text-xs sm:text-sm md:text-md font-medium md:font-bold">Learn about membership</button>
                </div>
              </div>
            </div> 
          </div>
        </div>
        <div id="LAST ELEMENT" className="last-element text-white pt-12">
          <div className=" flex-none md:flex justify-between px-5 md:px-24 md:py-4">
            <div className=" font-mono ">
               <div className="last">
                COMPANY
               </div>
               <div className="last">
                TEAM
               </div>
               <div className="last">
                DEI
               </div>
               <div className="last">
                HEALTH SYSTEMS
               </div>
               <div className="last ">
                CONTACT
               </div>
            </div> 
            <div className="flex py-20 md:py-0"> 
            <a href="https://twitter.com/" rel="noopener nofollow" target="_blank" className=" mr-5">
              <img className="" width="20" height="20" src="https://cdn.sanity.io/images/8qqycr4y/production/cd2781d5887784500708f6e7c2311b6b35c8498d-20x20.png" alt="bf2214f89b06f61ada48feba4599b93b747cbd86-57x47.png"/> 
              </a>
              <a href="https://www.instagram.com" rel="noopener nofollow" target="_blank" >
                <img width="20" height="20" src="https://cdn.sanity.io/images/8qqycr4y/production/3c491e55ecd18d626c56b3768ea0057d36caf09d-20x20.png" alt="8b0c50296c2ddf007f7dbd0d7e4158d3ffc060b9-57x57.png"/>
                </a>
            </div>
          </div>
          <div className=" px-5 md:px-24 py-0 md:py-10 pb-0">
            <div className=" border-t-2 flex justify-between pt-10 pb-12 md:pb-0">
              <div className="bottom md:grid grid-cols-4">
              <div className="bottom">
                Website Terms 
              </div>
              <div className="bottom md:ml-7">
                Privacy
              </div>
              <div className=" bottom">
                Policy
              </div>
              <div className=" bottom">
                Credits
              </div>
              </div>
              <div className="bottom pt-4">
              © Swasthlekh 2024
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 

  </div>
}
