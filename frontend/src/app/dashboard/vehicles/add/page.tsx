"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { createCar } from "@/store/slices/carsSlice";
import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Button,
    Input,
    Select,
    SelectItem,
    Textarea,
    Divider,
    Image as HeroImage,
    Chip,
} from "@heroui/react";
import { 
    ArrowLeft, 
    Save, 
    Plus, 
    DollarSign, 
    Car, 
    Fuel, 
    MapPin, 
    Type, 
    Image as LucideImage, 
    ShieldCheck, 
    CalendarDays,
    Trash2,
    Settings,
    User,
    Zap,
    Gauge,
    Users
} from "lucide-react";

export default function AddVehiclePage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

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
        year: 2024,
        transmission: "Automatic",
        seats: 4,
        acceleration: "",
        top_speed: "",
        engine: "",
        policy: "",
        host_name: "Arthur Brown",
        host_avatar: "",
        host_location: "",
        availability_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as string[],
    });

    const [features, setFeatures] = useState<string[]>(["Bluetooth", "GPS", "Wifi"]);
    const [newFeature, setNewFeature] = useState("");

    const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
        { key: "Engine", value: "V12" },
        { key: "Torque", value: "800 Nm" }
    ]);

    const [images, setImages] = useState<string[]>([]);
    const [newImageUrl, setNewImageUrl] = useState("");

    const handleChange = (name: string, value: any) => {
        setForm({ ...form, [name]: value });
    };

    const addFeature = () => {
        if (newFeature && !features.includes(newFeature)) {
            setFeatures([...features, newFeature]);
            setNewFeature("");
        }
    };

    const removeFeature = (f: string) => {
        setFeatures(features.filter(item => item !== f));
    };

    const addSpec = () => {
        setSpecs([...specs, { key: "", value: "" }]);
    };

    const updateSpec = (index: number, key: string, value: string) => {
        const newSpecs = [...specs];
        newSpecs[index] = { key, value };
        setSpecs(newSpecs);
    };

    const removeSpec = (index: number) => {
        setSpecs(specs.filter((_, i) => i !== index));
    };

    const addImage = () => {
        if (newImageUrl) {
            setImages([...images, newImageUrl]);
            setNewImageUrl("");
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const toggleDay = (day: string) => {
        setForm((prev) => ({
            ...prev,
            availability_days: prev.availability_days.includes(day)
                ? prev.availability_days.filter((d) => d !== day)
                : [...prev.availability_days, day],
        }));
    };

    const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const newErrors: Record<string, string> = {};
        if (!form.name) newErrors.name = "Model name is required";
        if (!form.brand) newErrors.brand = "Brand is required";
        if (!form.price || parseFloat(form.price) <= 0) newErrors.price = "Valid price is required";
        if (!form.type) newErrors.type = "Body type is required";
        if (!form.location) newErrors.location = "Location is required";
        if (!form.img) newErrors.img = "Main image URL is required";
        if (!form.description) newErrors.description = "Description is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        setErrors({});

        // Convert specs array to object
        const specifications = specs.reduce((acc, curr) => {
            if (curr.key) acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        const finalData = {
            ...form,
            features,
            specifications,
            images: images.length > 0 ? images : [form.img],
        };

        try {
            await dispatch(createCar(finalData)).unwrap();
            router.push("/dashboard/vehicles/all");
        } catch (error) {
            console.error("Failed to add vehicle", error);
            alert("Failed to add vehicle: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-4">
                <Button isIconOnly variant="flat" radius="full" onPress={() => router.back()}>
                    <ArrowLeft size={18} />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">New Vehicle</h1>
                    <p className="text-small text-default-500">Create a dynamic car detail page</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader className="flex items-center gap-3 pb-2">
                        <div className="p-2 bg-primary-50 rounded-lg text-primary">
                            <Car size={18} />
                        </div>
                        <div>
                            <p className="text-large font-bold">Basic Information</p>
                            <p className="text-small text-default-500">Model, brand and pricing</p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Model Name"
                                labelPlacement="outside"
                                placeholder="e.g. Tesla Model S Plaid"
                                size="lg"
                                variant="flat"
                                isInvalid={!!errors.name}
                                errorMessage={errors.name}
                                value={form.name}
                                onValueChange={(val) => {
                                    handleChange("name", val);
                                    if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                                }}
                            />
                            <Input
                                label="Brand"
                                labelPlacement="outside"
                                placeholder="e.g. Tesla"
                                size="lg"
                                variant="flat"
                                isInvalid={!!errors.brand}
                                errorMessage={errors.brand}
                                value={form.brand}
                                onValueChange={(val) => {
                                    handleChange("brand", val);
                                    if (errors.brand) setErrors(prev => ({ ...prev, brand: "" }));
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input
                                label="Daily Rate ($)"
                                labelPlacement="outside"
                                type="number"
                                placeholder="0"
                                size="lg"
                                variant="flat"
                                isInvalid={!!errors.price}
                                errorMessage={errors.price}
                                value={form.price}
                                onValueChange={(val) => {
                                    handleChange("price", val);
                                    if (errors.price) setErrors(prev => ({ ...prev, price: "" }));
                                }}
                                startContent={<DollarSign size={16} className="text-default-400" />}
                            />
                            <Input
                                label="Body Type"
                                labelPlacement="outside"
                                placeholder="e.g. Sedan, SUV"
                                size="lg"
                                variant="flat"
                                isInvalid={!!errors.type}
                                errorMessage={errors.type}
                                value={form.type}
                                onValueChange={(val) => {
                                    handleChange("type", val);
                                    if (errors.type) setErrors(prev => ({ ...prev, type: "" }));
                                }}
                            />
                            <Input
                                label="Location"
                                labelPlacement="outside"
                                placeholder="e.g. San Francisco"
                                size="lg"
                                variant="flat"
                                isInvalid={!!errors.location}
                                errorMessage={errors.location}
                                value={form.location}
                                onValueChange={(val) => {
                                    handleChange("location", val);
                                    if (errors.location) setErrors(prev => ({ ...prev, location: "" }));
                                }}
                                startContent={<MapPin size={16} className="text-default-400" />}
                            />
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader className="flex items-center gap-3 pb-2">
                        <div className="p-2 bg-warning-50 rounded-lg text-warning">
                            <Settings size={18} />
                        </div>
                        <div>
                            <p className="text-large font-bold">Technical Specifications</p>
                            <p className="text-small text-default-500">Performance and mechanical data</p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input
                                label="Year"
                                labelPlacement="outside"
                                type="number"
                                size="lg"
                                variant="flat"
                                value={form.year.toString()}
                                onValueChange={(val) => handleChange("year", parseInt(val))}
                                startContent={<CalendarDays size={16} className="text-default-400" />}
                            />
                            <Select
                                label="Transmission"
                                labelPlacement="outside"
                                size="lg"
                                variant="flat"
                                selectedKeys={[form.transmission]}
                                onSelectionChange={(keys) => handleChange("transmission", Array.from(keys)[0] as string)}
                            >
                                <SelectItem key="Automatic">Automatic</SelectItem>
                                <SelectItem key="Manual">Manual</SelectItem>
                                <SelectItem key="Semi-Automatic">Semi-Automatic</SelectItem>
                            </Select>
                            <Input
                                label="Seats"
                                labelPlacement="outside"
                                type="number"
                                size="lg"
                                variant="flat"
                                value={form.seats.toString()}
                                onValueChange={(val) => handleChange("seats", parseInt(val))}
                                startContent={<Users size={16} className="text-default-400" />}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Input
                                label="Fuel / Energy"
                                labelPlacement="outside"
                                placeholder="e.g. Electric, V8 Petrol"
                                size="lg"
                                variant="flat"
                                value={form.fuel}
                                onValueChange={(val) => handleChange("fuel", val)}
                                startContent={<Fuel size={16} className="text-default-400" />}
                            />
                            <Input
                                label="0-100 km/h (Acceleration)"
                                labelPlacement="outside"
                                placeholder="e.g. 2.5s"
                                size="lg"
                                variant="flat"
                                value={form.acceleration}
                                onValueChange={(val) => handleChange("acceleration", val)}
                                startContent={<Zap size={16} className="text-default-400" />}
                            />
                            <Input
                                label="Top Speed"
                                labelPlacement="outside"
                                placeholder="e.g. 320 km/h"
                                size="lg"
                                variant="flat"
                                value={form.top_speed}
                                onValueChange={(val) => handleChange("top_speed", val)}
                                startContent={<Gauge size={16} className="text-default-400" />}
                            />
                        </div>

                        <div className="space-y-4">
                            <p className="text-small font-medium">Custom Specifications</p>
                            {specs.map((spec, index) => (
                                <div key={index} className="flex gap-4 items-end">
                                    <Input
                                        placeholder="Key (e.g. Torque)"
                                        size="md"
                                        variant="flat"
                                        value={spec.key}
                                        onValueChange={(val) => updateSpec(index, val, spec.value)}
                                    />
                                    <Input
                                        placeholder="Value (e.g. 800 Nm)"
                                        size="md"
                                        variant="flat"
                                        value={spec.value}
                                        onValueChange={(val) => updateSpec(index, spec.key, val)}
                                    />
                                    <Button isIconOnly color="danger" variant="flat" onPress={() => removeSpec(index)}>
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            ))}
                            <Button variant="flat" startContent={<Plus size={16} />} onPress={addSpec}>
                                Add Specification
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader className="flex items-center gap-3 pb-2">
                        <div className="p-2 bg-success-50 rounded-lg text-success">
                            <LucideImage size={18} />
                        </div>
                        <div>
                            <p className="text-large font-bold">Media & Gallery</p>
                            <p className="text-small text-default-500">Photos and visual content</p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="space-y-6">
                        <Input
                            label="Main Image URL"
                            labelPlacement="outside"
                            placeholder="https://images.unsplash.com/..."
                            size="lg"
                            variant="flat"
                            isInvalid={!!errors.img}
                            errorMessage={errors.img}
                            value={form.img}
                            onValueChange={(val) => {
                                handleChange("img", val);
                                if (errors.img) setErrors(prev => ({ ...prev, img: "" }));
                            }}
                        />

                        <div className="space-y-4">
                            <p className="text-small font-medium">Gallery Images</p>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add image URL..."
                                    variant="flat"
                                    value={newImageUrl}
                                    onValueChange={setNewImageUrl}
                                />
                                <Button color="primary" onPress={addImage}>Add</Button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {images.map((img, index) => (
                                    <div key={index} className="relative group aspect-video rounded-xl overflow-hidden border">
                                        <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 p-1.5 bg-danger text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader className="flex items-center gap-3 pb-2">
                        <div className="p-2 bg-secondary-50 rounded-lg text-secondary">
                            <ShieldCheck size={18} />
                        </div>
                        <div>
                            <p className="text-large font-bold">Features & Policies</p>
                            <p className="text-small text-default-500">What's included and terms</p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="space-y-6">
                        <div className="space-y-3">
                            <p className="text-small font-medium">Features</p>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add feature (e.g. Bluetooth, GPS)..."
                                    variant="flat"
                                    value={newFeature}
                                    onValueChange={setNewFeature}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                />
                                <Button color="secondary" onPress={addFeature}>Add</Button>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {features.map((f) => (
                                    <Chip key={f} onClose={() => removeFeature(f)} variant="flat" color="secondary">
                                        {f}
                                    </Chip>
                                ))}
                            </div>
                            <p className="text-tiny text-default-400 italic">Supported icons: Bluetooth, GPS, Wifi, Camera, Speaker, Security, Fuel, Users, Gauge, Zap</p>
                        </div>

                        <Textarea
                            label="Description"
                            labelPlacement="outside"
                            placeholder="Full car description..."
                            size="lg"
                            variant="flat"
                            isInvalid={!!errors.description}
                            errorMessage={errors.description}
                            minRows={4}
                            value={form.description}
                            onValueChange={(val) => {
                                handleChange("description", val);
                                if (errors.description) setErrors(prev => ({ ...prev, description: "" }));
                            }}
                        />

                        <Textarea
                            label="Cancellation Policy"
                            labelPlacement="outside"
                            placeholder="e.g. Free cancellation up to 48h before..."
                            size="lg"
                            variant="flat"
                            minRows={2}
                            value={form.policy}
                            onValueChange={(val) => handleChange("policy", val)}
                        />
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader className="flex items-center gap-3 pb-2">
                        <div className="p-2 bg-default-100 rounded-lg">
                            <User size={18} />
                        </div>
                        <div>
                            <p className="text-large font-bold">Host Information</p>
                            <p className="text-small text-default-500">Who is renting this vehicle?</p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Host Name"
                                labelPlacement="outside"
                                placeholder="e.g. Arthur Brown"
                                size="lg"
                                variant="flat"
                                value={form.host_name}
                                onValueChange={(val) => handleChange("host_name", val)}
                            />
                            <Input
                                label="Host Location"
                                labelPlacement="outside"
                                placeholder="e.g. San Francisco, US"
                                size="lg"
                                variant="flat"
                                value={form.host_location}
                                onValueChange={(val) => handleChange("host_location", val)}
                            />
                        </div>
                        <Input
                            label="Host Avatar URL"
                            labelPlacement="outside"
                            placeholder="https://..."
                            size="lg"
                            variant="flat"
                            value={form.host_avatar}
                            onValueChange={(val) => handleChange("host_avatar", val)}
                        />
                    </CardBody>
                </Card>

                <div className="flex justify-end gap-3 pb-10">
                    <Button size="lg" variant="bordered" onPress={() => router.back()}>
                        Cancel
                    </Button>
                    <Button
                        size="lg"
                        type="submit"
                        color="primary"
                        isLoading={loading}
                        startContent={!loading && <Save size={20} />}
                        className="px-10 font-bold"
                    >
                        Create Vehicle
                    </Button>
                </div>
            </form>
        </div>
    );
}
