
import { EnrichedMediaUpload } from '@/types/media';
import Image from 'next/image';
import { motion } from 'framer-motion';

const ReportCard = ({ report }: { report: EnrichedMediaUpload }) => {

    // Use ImageKit to generate a thumbnail URL
    const thumbnailUrl = report.filePath ? `https://ik.imagekit.io/${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!.split('/').pop()}/${report.filePath}?tr=w-400,h-300,fo-auto` : report.url;

    return (
        <motion.div 
            className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-2 transition-transform duration-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative h-48 w-full">
                <Image 
                    src={thumbnailUrl} 
                    alt={`Preview of ${report.name}`}
                    layout="fill"
                    objectFit="cover"
                />
                <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-white text-sm font-bold ${report.isdeepfake ? 'bg-red-600' : 'bg-green-600'}`}>
                    {report.isdeepfake ? 'Deepfake Detected' : 'Authentic'}
                </div>
            </div>
            <div className="p-6">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-white truncate">{report.name}</h3>
                    <p className="text-sm text-gray-400">{report.type} - {(report.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                
                <div className="mb-4">
                    <p className="text-gray-300 font-semibold">Confidence Score:</p>
                    <div className="w-full bg-gray-700 rounded-full h-4 mt-2">
                        <motion.div 
                            className="bg-gradient-to-r from-purple-500 to-cyan-500 h-4 rounded-full"
                            style={{ width: `${report.confidence}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${report.confidence}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>
                    <p className="text-right text-lg font-bold text-white mt-1">{report.confidence}%</p>
                </div>

                <div>
                    <p className="text-gray-300 font-semibold">Explanation:</p>
                    <p className="text-gray-400 mt-2 text-sm leading-relaxed">{report.explanation}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default ReportCard;
