"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { createCar } from "@/store/slices/carsSlice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

export default function AddVehiclePage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        price: "",
        type: "",
        brand: "",
        location: "",
        fuel: "",
        img: "",
        description: "",
        status: "Available",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await dispatch(createCar(form)).unwrap();
            router.push("/dashboard/vehicles/all");
        } catch (error) {
            console.error("Failed to add vehicle", error);
            alert("Failed to add vehicle: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add New Vehicle</h1>
                    <p className="text-sm text-slate-500">Register a new car to the platform catalog.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Vehicle Specifications</CardTitle>
                        <CardDescription>Fill out the essential data points for the new fleet addition.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Exact Model Name</Label>
                            <Input id="name" name="name" required placeholder="e.g. Tesla Model S" value={form.name} onChange={handleChange} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price Per Day ($)</Label>
                                <Input id="price" name="price" type="number" required placeholder="100" value={form.price} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Body Type</Label>
                                <Input id="type" name="type" required placeholder="e.g. Sedan, SUV" value={form.type} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="brand">Brand / Make</Label>
                                <Input id="brand" name="brand" required placeholder="e.g. Tesla" value={form.brand} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fuel">Fuel Type</Label>
                                <Input id="fuel" name="fuel" required placeholder="e.g. Electric, Petrol" value={form.fuel} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Station Hub / Location</Label>
                                <Input id="location" name="location" required placeholder="e.g. Downtown Hub" value={form.location} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Availability Status</Label>
                                <select
                                    id="status"
                                    name="status"
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={form.status}
                                    onChange={(e: any) => handleChange(e)}
                                >
                                    <option value="Available">Available</option>
                                    <option value="Rented">Rented</option>
                                    <option value="Maintenance">Maintenance</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Vehicle Image</Label>

                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                                {/* Image Preview */}
                                <div className="w-3/4 h-auto mx-auto aspect-[1/1] rounded-lg border border-gray-200 overflow-hidden relative flex flex-col justify-center items-center shrink-0">
                                    {form.img ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={form.img} alt="Vehicle preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-gray-400 flex flex-col items-center">
                                            <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm">No Image</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Upload Controls */}
                            <div className="flex-1 space-y-2 w-full">
                                <div className="space-y-2">
                                    <Label htmlFor="img_file" className="text-sm text-slate-600">Upload New Photo</Label>
                                    <Input
                                        id="img_file"
                                        type="file"
                                        accept="image/*"
                                        className="cursor-pointer file:cursor-pointer"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (event) => {
                                                    const result = event.target?.result as string;
                                                    setForm({ ...form, img: result });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <p className="text-xs text-slate-400">Supported formats: JPG, PNG, WEBP. Max size: 2MB.</p>
                                </div>

                                <div className="relative flex items-center gap-4">
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                    <span className="text-xs text-gray-400 font-medium">OR URL</span>
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="img" className="text-sm text-slate-600">Provide External Image URL</Label>
                                    <Input
                                        id="img"
                                        name="img"
                                        placeholder="https://example.com/car.jpg"
                                        value={form.img.startsWith('data:') ? '' : form.img}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Detailed Description</Label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                required
                                placeholder="Describe the vehicle's features and perks."
                                value={form.description}
                                onChange={handleChange}
                                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50 border-t py-4 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" className="bg-black text-white gap-2" disabled={loading}>
                            {loading ? "Saving..." : <><Save className="w-4 h-4" /> Save Vehicle</>}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
