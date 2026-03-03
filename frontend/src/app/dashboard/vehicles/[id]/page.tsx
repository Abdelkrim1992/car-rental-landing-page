"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, MapPin, Fuel, DollarSign, Activity, Car as CarIcon, Flag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function VehicleDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { cars } = useAppSelector((state) => state.cars);

    const carId = params?.id as string;
    const car = cars.find((c) => c.id === carId);

    if (!car) {
        return (
            <div className="p-10 text-center space-y-4">
                <p className="text-slate-500">Vehicle not found in local state.</p>
                <Button variant="outline" onClick={() => router.push("/dashboard/vehicles/all")}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{car.name}</h1>
                        <p className="text-sm text-slate-500">Vehicle ID: {car.id.slice(0, 8)}</p>
                    </div>
                </div>
                <Button variant="outline" className="gap-2" asChild>
                    <Link href={`/dashboard/vehicles/${car.id}/edit`}>
                        <Edit className="w-4 h-4" /> Edit Vehicle
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Col - Overview Image */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="overflow-hidden">
                        <div className="w-full h-48 relative bg-slate-100 flex items-center justify-center">
                            {car.img ? (
                                <Image src={car.img} alt={car.name} fill className="object-cover" />
                            ) : (
                                <CarIcon className="w-12 h-12 text-slate-300" />
                            )}
                        </div>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Status</span>
                                <Badge className={
                                    car.status === "Available" ? "bg-green-500 hover:bg-green-600" :
                                        car.status === "Rented" ? "bg-blue-500 hover:bg-blue-600" :
                                            "bg-orange-500 hover:bg-orange-600"
                                }>
                                    {car.status || "Available"}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Type</span>
                                <span className="font-medium">{car.type}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Brand</span>
                                <span className="font-medium">{car.brand}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Col - Details */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Specifications</CardTitle>
                            <CardDescription>Primary vehicle capabilities.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-1 bg-slate-50 p-4 rounded border">
                                    <span className="flex items-center gap-2 text-sm text-slate-500"><DollarSign className="w-4 h-4 text-emerald-500" /> Price</span>
                                    <span className="font-bold text-lg">{car.price}</span>
                                </div>
                                <div className="space-y-1 bg-slate-50 p-4 rounded border">
                                    <span className="flex items-center gap-2 text-sm text-slate-500"><Fuel className="w-4 h-4 text-orange-500" /> Fuel</span>
                                    <span className="font-bold text-lg">{car.fuel}</span>
                                </div>
                                <div className="space-y-1 bg-slate-50 p-4 rounded border">
                                    <span className="flex items-center gap-2 text-sm text-slate-500"><Activity className="w-4 h-4 text-blue-500" /> Mileage</span>
                                    <span className="font-bold text-lg">{car.mileage}</span>
                                </div>
                                <div className="space-y-1 bg-slate-50 p-4 rounded border">
                                    <span className="flex items-center gap-2 text-sm text-slate-500"><MapPin className="w-4 h-4 text-purple-500" /> Hub</span>
                                    <span className="font-bold text-lg">{car.location}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                {car.description || "No description provided for this vehicle. Ensure you maintain accurate descriptions so users correctly identify the model capabilities."}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
