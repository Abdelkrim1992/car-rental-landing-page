"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSettings, updateSettings } from "@/store/slices/settingsSlice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function SettingsPage() {
    const dispatch = useAppDispatch();
    const { data: settings, loading } = useAppSelector((state) => state.settings);

    const [formData, setFormData] = useState({
        business_name: "",
        tagline: "",
        hero_title: "",
        hero_subtitle: "",
        phone: "",
        email: "",
        address: "",
        working_hours: "",
        stats_cars: 0,
        stats_rentals: 0,
    });

    useEffect(() => {
        dispatch(fetchSettings());
    }, [dispatch]);

    useEffect(() => {
        if (settings) {
            setFormData({
                business_name: settings.business_name || "",
                tagline: settings.tagline || "",
                hero_title: settings.hero_title || "",
                hero_subtitle: settings.hero_subtitle || "",
                phone: settings.phone || "",
                email: settings.email || "",
                address: settings.address || "",
                working_hours: settings.working_hours || "",
                stats_cars: settings.stats_cars || 0,
                stats_rentals: settings.stats_rentals || 0,
            });
        }
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSave = async () => {
        try {
            await dispatch(updateSettings(formData)).unwrap();
            toast.success("Settings updated successfully");
        } catch (error) {
            toast.error("Failed to update settings");
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
                <p className="text-sm text-slate-500">Manage your agency preferences and admin account.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left col - Navigation/Tabs mockup */}
                <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0">
                    <Button variant="secondary" className="justify-start">General</Button>
                    <Button variant="ghost" className="justify-start text-slate-600 font-normal">Security</Button>
                    <Button variant="ghost" className="justify-start text-slate-600 font-normal">Notifications</Button>
                    <Button variant="ghost" className="justify-start text-slate-600 font-normal">Billing</Button>
                </div>

                {/* Right col - Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Agency Profile</CardTitle>
                            <CardDescription>Update your brand information visible to users.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="business_name">Business Name</Label>
                                    <Input id="business_name" value={formData.business_name} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tagline">Tagline</Label>
                                    <Input id="tagline" value={formData.tagline} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hero_title">Hero Title</Label>
                                <Input id="hero_title" value={formData.hero_title} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                                <Input id="hero_subtitle" value={formData.hero_subtitle} onChange={handleChange} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input id="phone" value={formData.phone} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={formData.email} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" value={formData.address} onChange={handleChange} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="working_hours">Working Hours</Label>
                                <Input id="working_hours" value={formData.working_hours} onChange={handleChange} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div className="space-y-2">
                                    <Label htmlFor="stats_cars">Luxury Cars Count</Label>
                                    <Input id="stats_cars" type="number" value={formData.stats_cars} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stats_rentals">Successful Rentals</Label>
                                    <Input id="stats_rentals" type="number" value={formData.stats_rentals} onChange={handleChange} />
                                </div>
                            </div>

                        </CardContent>
                        <CardFooter className="bg-slate-50 border-t py-4 justify-end">
                            <Button className="bg-slate-900 text-white" onClick={handleSave} disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Booking Rules</CardTitle>
                            <CardDescription>Configure automation parameters.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Require manual approval</Label>
                                    <p className="text-xs text-slate-500">Hold bookings in pending until you hit approve.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between mt-4 border-t pt-4">
                                <div className="space-y-0.5">
                                    <Label>Email Alerts</Label>
                                    <p className="text-xs text-slate-500">Receive an email instantly on new bookings.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
