import React from 'react';
import Member from '@/components/Member';
import Image from 'next/image';

const AboutPage = () => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">About Our Mission</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our mission is to combat the spread of misinformation by providing a powerful and accessible tool for detecting deepfakes in images and videos. We believe that everyone has the right to know the truth, and we are committed to using our expertise in AI to make that a reality.</p>
        </div>

        <div className="mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12">Our Technology</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="w-full md:w-1/2">
              <Image src="/tech.jpg" alt="Technology" width={500} height={300} className="rounded-lg shadow-xl" />
            </div>
            <div className="w-full md:w-1/2">
              <p className="text-lg text-gray-700 leading-relaxed">We use a state-of-the-art deep learning model that has been trained on a massive dataset of real and fake images and videos. Our model is able to identify subtle inconsistencies in the media that are invisible to the naked eye, allowing us to detect deepfakes with a high degree of accuracy. We are constantly working to improve our model and stay ahead of the latest deepfake techniques.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <Member name="John Doe" role="AI Specialist" imageUrl="/member1.jpg" />
            <Member name="Jane Smith" role="Frontend Developer" imageUrl="/member2.jpg" />
            <Member name="Peter Jones" role="UX/UI Designer" imageUrl="/member3.jpg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
