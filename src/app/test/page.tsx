"use client";

export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white p-8">
      <h1 className="text-3xl font-bold text-primary">Global Styles Test</h1>
      <p className="text-error">This is an error text</p>

      <div className="mt-6 p-4 bg-card rounded">
        <p className="text-lg">This is a card background</p>
      </div>

      <input
        type="text"
        placeholder="Test Input"
        className="mt-4 bg-input text-white border border-gray-400 rounded px-3 py-2"
      />

      <button className="mt-4 bg-primary text-white px-4 py-2 rounded">
        Primary Button
      </button>
    </div>
  );
}
