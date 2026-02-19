
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

async function getReport(id) {
  const { db } = await connectToDatabase();
  const report = await db.collection('analysisReports').findOne({ _id: new ObjectId(id) });
  return report;
}

const ReportPage = async ({ params }) => {
  const report = await getReport(params.id);

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-4xl font-bold">Report Not Found</h1>
        <p className="mt-4 text-lg">We couldn't find the report you're looking for.</p>
        <Link href="/dashboard" className="mt-8 px-6 py-3 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-600 transition-colors">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const confidenceColor = report.isdeepfake ? 'text-red-400' : 'text-green-400';
  const fabricationColor = report.fabricationRatio > 50 ? 'text-yellow-400' : 'text-blue-400';

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/dashboard" className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors">
            <FaArrowLeft className="mr-2" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-2">Analysis Report</h1>
            <p className="text-gray-400">Report ID: {params.id}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">File Details</h2>
              <div className="bg-gray-700 p-6 rounded-lg">
                <p className="text-lg"><span className="font-bold">Name:</span> {report.name}</p>
                <p className="text-lg"><span className="font-bold">Type:</span> {report.type}</p>
                <p className="text-lg"><span className="font-bold">Size:</span> {(report.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              
              <div className="mt-8">
                 {report.type.startsWith('image/') && <img src={report.url} alt={report.name} className="w-full h-auto rounded-lg shadow-md" />}
                 {report.type.startsWith('video/') && <video src={report.url} controls className="w-full h-auto rounded-lg shadow-md" />}
                 {report.type.startsWith('audio/') && <audio src={report.url} controls className="w-full mt-4" />}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Detection Results</h2>
              <div className="bg-gray-700 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xl font-bold">Confidence Score</p>
                  <p className={`text-4xl font-bold ${confidenceColor}`}>{report.confidence}%</p>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-4 mb-6">
                  <div className={`h-4 rounded-full ${report.isdeepfake ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${report.confidence}%` }}></div>
                </div>
                
                <div className="mb-6">
                  <p className="text-xl font-bold mb-2">Classification</p>
                  <p className={`text-2xl font-semibold ${confidenceColor}`}>{report.isdeepfake ? 'Deepfake Detected' : 'Authentic'}</p>
                </div>

                <div className="mb-6">
                  <p className="text-xl font-bold mb-2">Fabrication Ratio</p>
                  <p className={`text-2xl font-semibold ${fabricationColor}`}>{report.fabricationRatio}%</p>
                   <div className="w-full bg-gray-600 rounded-full h-4 mt-2">
                    <div className={`h-4 rounded-full ${report.fabricationRatio > 50 ? 'bg-yellow-500' : 'bg-blue-500'}`} style={{ width: `${report.fabricationRatio}%` }}></div>
                  </div>
                </div>

                <div>
                  <p className="text-xl font-bold mb-2">Explanation</p>
                  <p className="text-gray-300">{report.explanation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
