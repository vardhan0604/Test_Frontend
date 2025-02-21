"use client"
import { useState } from "react";

interface ApiResponse {
    is_success: boolean;
    user_id: string;
    email: string;
    roll_number: string;
    numbers: string[];
    alphabets: string[];
    highest_alphabet: string[];
}

export default function Home() {
    const [input, setInput] = useState<string>('{"data": ["A", "1", "B", "2"]}');
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const handleSubmit = async (): Promise<void> => {
        try {
            const parsedInput = JSON.parse(input);
            const res = await fetch("https://test-backend-0kwh.onrender.com/bfhl", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsedInput),
            });
            const data: ApiResponse = await res.json();
            setResponse(data);
        } catch (error) {
            alert("Invalid JSON or Server Error");
        }
    };

    const filteredResponse = (): Partial<ApiResponse> | null => {
        if (!response) return null;
        let result: Partial<ApiResponse> = {};
        if (selectedFilters.includes("numbers")) result.numbers = response.numbers;
        if (selectedFilters.includes("alphabets")) result.alphabets = response.alphabets;
        if (selectedFilters.includes("highest_alphabet")) result.highest_alphabet = response.highest_alphabet;
        return result;
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 text-black">
            <h1 className="text-2xl font-bold mb-4">BFHL Challenge</h1>
            <textarea
                className="border p-2 w-full max-w-lg bg-white text-black"
                rows={4}
                value={input}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            />
            <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleSubmit}
            >Submit</button>

            {response && (
                <div className="mt-4">
                    <label className="block font-semibold mb-2">Filter Response:</label>
                    <select
                        multiple
                        className="border p-2 w-full max-w-lg bg-white text-black"
                        disabled={!response}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                            setSelectedFilters(Array.from(e.target.selectedOptions, option => option.value))}
                    >
                        <option value="numbers">Numbers</option>
                        <option value="alphabets">Alphabets</option>
                        <option value="highest_alphabet">Highest Alphabet</option>
                    </select>
                    <pre className="mt-2 bg-white p-2 border text-black rounded shadow">{JSON.stringify(filteredResponse(), null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
