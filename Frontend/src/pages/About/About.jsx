import React from "react";

export default function ProjectDocumentation() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-12">
        <section className="text-center pt-50">
          <h1 className="text-6xl font-bold mb-4">
            AI Resource Intelligence Platform
          </h1>
          <p className="text-lg text-white">
            Real-Time AI-Based System Monitoring & Optimization Platform
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
          <p className="leading-relaxed text-gray-300">
            The AI Resource Intelligence Platform is a real-time system
            monitoring solution that collects device-level telemetry data,
            analyzes user activity patterns using an LSTM-based deep learning
            model, and provides intelligent optimization recommendations to
            improve power efficiency and performance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">System Architecture</h2>
          <div className="bg-black p-6 rounded-xl text-center shadow-sm border">
            <p className="text-2xl">User Device (Agent)</p>
            <p className="text-center my-2 text-xl">↓</p>
            <p className="text-2xl">Flask Backend (Docker + AWS EC2)</p>
            <p className="text-center my-2 text-xl">↓</p>
            <p className="text-2xl">React Dashboard (Live Monitoring)</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Technologies Used</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <li className=" p-4 rounded-lg border shadow-sm">Python</li>
            <li className=" p-4 rounded-lg border shadow-sm">Flask</li>
            <li className=" p-4 rounded-lg border shadow-sm">
              TensorFlow (LSTM)
            </li>
            <li className=" p-4 rounded-lg border shadow-sm">
              Scikit-learn
            </li>
            <li className=" p-4 rounded-lg border shadow-sm">
              React (Vite)
            </li>
            <li className=" p-4 rounded-lg border shadow-sm">
              Tailwind CSS
            </li>
            <li className=" p-4 rounded-lg border shadow-sm">Docker</li>
            <li className=" p-4 rounded-lg border shadow-sm">
              AWS EC2
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Backend API Endpoints</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200  rounded-lg">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-3 text-left border">Endpoint</th>
                  <th className="p-3 text-left border">Method</th>
                  <th className="p-3 text-left border">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border">/status</td>
                  <td className="p-3 border">GET</td>
                  <td className="p-3 border">Backend health check</td>
                </tr>
                <tr>
                  <td className="p-3 border">/analyze</td>
                  <td className="p-3 border">POST</td>
                  <td className="p-3 border">Receives telemetry data</td>
                </tr>
                <tr>
                  <td className="p-3 border">/client-system</td>
                  <td className="p-3 border">GET</td>
                  <td className="p-3 border">Returns latest system metrics</td>
                </tr>
                <tr>
                  <td className="p-3 border">/predicted</td>
                  <td className="p-3 border">GET</td>
                  <td className="p-3 border">Returns AI prediction results</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Machine Learning Model
          </h2>
          <ul className="space-y-2">
            <li>• LSTM (Long Short-Term Memory) Neural Network</li>
            <li>• Uses sliding window sequence input</li>
            <li>• Predicts user idle probability</li>
            <li>• Generates optimization recommendations</li>
            <li>• Estimates battery gain improvement</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
