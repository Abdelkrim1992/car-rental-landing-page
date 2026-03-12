"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Chip,
    Divider,
    Image as HeroImage
} from "@heroui/react";
import { 
    ArrowLeft, 
    Edit, 
    MapPin, 
    Fuel, 
    Car as CarIcon, 
    ShieldCheck, 
    Zap, 
    Gauge, 
    CalendarDays,
    Users,
    Settings,
    User,
    CheckCircle2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function VehicleDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { cars } = useAppSelector((state) => state.cars);

    const carId = params?.id as string;
    const car = cars.find((c) => c.id === carId);

    const [selectedImg, setSelectedImg] = useState(0);

    if (!car) {
        return (
            <div className="py-16 text-center space-y-4">
                <div className="p-4 bg-warning-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto text-warning">
                    <CarIcon className="size-8" />
                </div>
                <h2 className="text-xl font-bold">Vehicle Not Found</h2>
                <p className="text-small text-default-400">The requested vehicle record is missing.</p>
                <Button variant="flat" onPress={() => router.push("/dashboard/vehicles/all")}>
                    Back to Fleet
                </Button>
            </div>
        );
    }

    const getStatusColor = (status?: string): "success" | "primary" | "warning" => {
        const s = status?.toLowerCase() || "available";
        if (s.includes("available")) return "success";
        if (s.includes("rented")) return "primary";
        return "warning";
    };

    const galleryImages = car.images && car.images.length > 0 ? car.images : [car.img];

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button isIconOnly variant="flat" radius="full" onPress={() => router.back()}>
                        <ArrowLeft size={18} />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{car.name}</h1>
                        <p className="text-small text-default-500">Asset {car.id.slice(0, 8)} • {car.brand} {car.year}</p>
                    </div>
                </div>
                <Button
                    color="primary"
                    startContent={<Edit size={16} />}
                    as={Link}
                    href={`/dashboard/vehicles/${car.id}/edit`}
                >
                    Edit Vehicle
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    <Card className="overflow-hidden">
                        <div className="p-2">
                            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-default-100 relative">
                                {galleryImages[selectedImg] ? (
                                    <Image src={galleryImages[selectedImg]} alt={car.name} fill className="object-cover" />
                                ) : (
                                    <CarIcon className="size-12 text-default-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                )}
                            </div>
                        </div>
                        {galleryImages.length > 1 && (
                            <div className="px-2 pb-2">
                                <div className="grid grid-cols-4 gap-2">
                                    {galleryImages.slice(0, 4).map((img, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => setSelectedImg(i)}
                                            className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${selectedImg === i ? 'border-primary' : 'border-transparent opacity-60'}`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                        <CardBody className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-small text-default-500 font-medium">Status</span>
                                <Chip variant="flat" color={getStatusColor(car.status)} size="sm">
                                    {car.status || "Available"}
                                </Chip>
                            </div>
                            <Divider />
                            <div className="flex items-center justify-between">
                                <span className="text-small text-default-500 font-medium">Daily Rate</span>
                                <span className="text-xl font-bold text-primary">{car.price}</span>
                            </div>
                            <Divider />
                            <div className="flex items-center justify-between">
                                <span className="text-small text-default-500 font-medium">Transmission</span>
                                <span className="font-semibold">{car.transmission || "Automatic"}</span>
                            </div>
                            <Divider />
                            <div className="flex items-center justify-between">
                                <span className="text-small text-default-500 font-medium">Seats</span>
                                <span className="font-semibold">{car.seats || 4} Person</span>
                            </div>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardHeader className="flex items-center gap-3 pb-2">
                            <div className="p-2 bg-default-100 rounded-lg">
                                <User size={18} />
                            </div>
                            <div>
                                <p className="text-medium font-bold">Host Details</p>
                                <p className="text-tiny text-default-500">Resource Provider</p>
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody className="space-y-4">
                            <div className="flex items-center gap-3">
                                {car.host_avatar ? (
                                    <HeroImage src={car.host_avatar} alt="" className="w-10 h-10 rounded-full" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-default-200 flex items-center justify-center font-bold text-default-500">
                                        {car.host_name ? car.host_name[0] : 'U'}
                                    </div>
                                )}
                                <div>
                                    <p className="text-small font-bold">{car.host_name || "Arthur Brown"}</p>
                                    <p className="text-tiny text-default-500">{car.host_location || "San Francisco"}</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                            <CardBody className="flex flex-col items-center gap-2 text-center py-5">
                                <div className="p-2 bg-primary-50 rounded-lg text-primary">
                                    <Fuel size={18} />
                                </div>
                                <p className="text-tiny text-default-400 font-medium">Energy</p>
                                <p className="text-small font-bold">{car.fuel}</p>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody className="flex flex-col items-center gap-2 text-center py-5">
                                <div className="p-2 bg-danger-50 rounded-lg text-danger">
                                    <Zap size={18} />
                                </div>
                                <p className="text-tiny text-default-400 font-medium">0-100 km/h</p>
                                <p className="text-small font-bold">{car.acceleration || "---"}</p>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody className="flex flex-col items-center gap-2 text-center py-5">
                                <div className="p-2 bg-warning-50 rounded-lg text-warning">
                                    <Gauge size={18} />
                                </div>
                                <p className="text-tiny text-default-400 font-medium">Top Speed</p>
                                <p className="text-small font-bold">{car.top_speed || "---"}</p>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody className="flex flex-col items-center gap-2 text-center py-5">
                                <div className="p-2 bg-success-50 rounded-lg text-success">
                                    <MapPin size={18} />
                                </div>
                                <p className="text-tiny text-default-400 font-medium">Location</p>
                                <p className="text-small font-bold truncate w-full">{car.location.split(',')[0]}</p>
                            </CardBody>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader className="flex items-center gap-3 pb-2">
                            <ShieldCheck className="size-5 text-success" />
                            <p className="text-large font-bold">Vehicle Description</p>
                        </CardHeader>
                        <CardBody>
                            <p className="text-default-600 leading-relaxed">
                                {car.description || "No description provided for this vehicle."}
                            </p>
                        </CardBody>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader className="flex items-center gap-3 pb-1">
                                <Settings className="size-5 text-primary" />
                                <p className="text-large font-bold">Features</p>
                            </CardHeader>
                            <CardBody>
                                <div className="flex flex-wrap gap-2">
                                    {car.features && car.features.length > 0 ? (
                                        car.features.map((f: string) => (
                                            <div key={f} className="flex items-center gap-1.5 px-3 py-1 bg-default-100 rounded-full text-tiny font-medium text-default-600">
                                                <CheckCircle2 size={12} className="text-success" />
                                                {f}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-tiny text-default-400 italic">No features listed</p>
                                    )}
                                </div>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader className="flex items-center gap-3 pb-1">
                                <Gauge className="size-5 text-warning" />
                                <p className="text-large font-bold">Technical Specs</p>
                            </CardHeader>
                            <CardBody className="space-y-2">
                                {car.specifications && Object.entries(car.specifications).length > 0 ? (
                                    Object.entries(car.specifications).map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-center text-small">
                                            <span className="text-default-500 capitalize">{key.replace(/_/g, ' ')}</span>
                                            <span className="font-semibold">{String(value)}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-tiny text-default-400 italic">No specifications listed</p>
                                )}
                            </CardBody>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader className="flex items-center gap-3 pb-2">
                            <CalendarDays className="size-5 text-primary" />
                            <p className="text-large font-bold">Availability Schedule</p>
                        </CardHeader>
                        <CardBody>
                            <div className="flex flex-wrap gap-2">
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                                    const isAvailable = (car.availability_days || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]).includes(day);
                                    return (
                                        <Chip
                                            key={day}
                                            variant="flat"
                                            color={isAvailable ? "success" : "default"}
                                            size="sm"
                                            className={!isAvailable ? "line-through opacity-50" : ""}
                                        >
                                            {day.slice(0, 3)}
                                        </Chip>
                                    );
                                })}
                            </div>
                        </CardBody>
                    </Card>

                    {car.policy && (
                        <Card className="bg-default-50 border-none shadow-none">
                            <CardBody className="py-4">
                                <p className="text-tiny font-bold uppercase text-default-400 tracking-wider mb-2">Policy & Terms</p>
                                <p className="text-small text-default-600 italic">"{car.policy}"</p>
                            </CardBody>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
