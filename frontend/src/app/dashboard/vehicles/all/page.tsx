"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { deleteCar, fetchCars } from "@/store/slices/carsSlice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Car, Settings2, ShieldCheck, Plus, ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AllVehiclesPage() {
    const { cars } = useAppSelector((state) => state.cars);
    const dispatch = useAppDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [viewMode, setViewMode] = useState<"table" | "cards">("table");

    const totalPages = Math.ceil(cars.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedCars = cars.slice(startIndex, startIndex + rowsPerPage);

    useEffect(() => {
        dispatch(fetchCars());
    }, [dispatch]);

    const handleDeleteVehicle = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to permanently delete the ${name}?`)) {
            try {
                await dispatch(deleteCar(id)).unwrap();
            } catch (err) {
                alert("Failed to delete vehicle.");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">All Vehicles</h1>
                    <p className="text-sm text-slate-500">Manage your fleet of rental cars.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-200 rounded-md p-1 bg-white">
                        <button
                            onClick={() => setViewMode("table")}
                            className={`p-1.5 rounded text-sm transition-colors ${viewMode === "table" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode("cards")}
                            className={`p-1.5 rounded text-sm transition-colors ${viewMode === "cards" ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                    </div>
                    <Button className="bg-black text-white gap-2" asChild>
                        <Link href="/dashboard/vehicles/add">
                            <Plus className="w-4 h-4" /> Add New Car
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                            <Car className="w-4 h-4" /> Active Fleet
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{cars.filter(c => c.status === "Available").length}</div>
                        <p className="text-xs text-slate-400 mt-1">Ready for rent</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                            <Settings2 className="w-4 h-4" /> In Maintenance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{cars.filter(c => c.status === "Maintenance" || c.status === "maintenace" || c.status?.toLowerCase().includes("maintenance")).length}</div>
                        <p className="text-xs text-slate-400 mt-1">Currently being serviced</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" /> Insurance Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">100%</div>
                        <p className="text-xs text-slate-400 mt-1">All vehicles covered</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Fleet Directory</CardTitle>
                    <CardDescription>
                        You have {cars.length} vehicles in your fleet.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        {viewMode === "table" ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">Image</TableHead>
                                        <TableHead>Vehicle Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead className="text-right">Price/Day</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedCars.map((car) => (
                                        <TableRow key={car.id}>
                                            <TableCell>
                                                <div className="h-10 w-16 relative bg-slate-100 rounded overflow-hidden">
                                                    <Image
                                                        src={car.img}
                                                        alt={car.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{car.name}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-slate-600 font-normal">
                                                    {car.type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={
                                                    car.status === "Available" ? "bg-green-500 hover:bg-green-600" :
                                                        car.status === "Rented" ? "bg-blue-500 hover:bg-blue-600" :
                                                            "bg-orange-500 hover:bg-orange-600"
                                                }>
                                                    {car.status || "Available"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-500">{car.location}</TableCell>
                                            <TableCell className="text-right font-medium">{car.price}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="secondary" size="sm" asChild>
                                                        <Link href={`/dashboard/vehicles/${car.id}`}>Details</Link>
                                                    </Button>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <Link href={`/dashboard/vehicles/${car.id}/edit`}>Edit</Link>
                                                    </Button>
                                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteVehicle(car.id, car.name)}>
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="p-6 bg-slate-50/50">
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                    {paginatedCars.map((car) => (
                                        <div key={car.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                            <div className="h-48 w-full relative bg-slate-100">
                                                <Image src={car.img} alt={car.name} fill className="object-cover" />
                                                <div className="absolute top-3 left-3">
                                                    <Badge className={
                                                        car.status === "Available" ? "bg-green-500" :
                                                            car.status === "Rented" ? "bg-blue-500" :
                                                                "bg-orange-500"
                                                    }>
                                                        {car.status || "Available"}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="p-5 flex flex-col flex-1">
                                                <div className="flex items-center justify-between mb-3">
                                                    <Badge variant="outline" className="text-xs text-slate-500 bg-slate-50 font-normal py-0">
                                                        {car.type}
                                                    </Badge>
                                                    <span className="text-sm font-semibold text-slate-900">{car.price}</span>
                                                </div>
                                                <h3 className="font-semibold text-lg text-slate-900 truncate" title={car.name}>{car.name}</h3>
                                                <div className="text-sm text-slate-500 mt-1 mb-5 flex items-center gap-1.5 break-words">
                                                    <Car className="w-4 h-4 shrink-0" /> {car.brand} &nbsp;•&nbsp; {car.location}
                                                </div>

                                                <div className="mt-auto grid grid-cols-3 gap-2">
                                                    <Button variant="secondary" size="sm" className="w-full text-xs h-9" asChild>
                                                        <Link href={`/dashboard/vehicles/${car.id}`}>Details</Link>
                                                    </Button>
                                                    <Button variant="outline" size="sm" className="w-full text-xs h-9" asChild>
                                                        <Link href={`/dashboard/vehicles/${car.id}/edit`}>Edit</Link>
                                                    </Button>
                                                    <Button variant="destructive" size="sm" className="w-full text-xs h-9" onClick={() => handleDeleteVehicle(car.id, car.name)}>
                                                        Del
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {cars.length > 0 && (
                            <div className="flex items-center justify-between px-4 py-4 border-t bg-gray-50/50">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <span>Rows per page:</span>
                                    <select
                                        value={rowsPerPage}
                                        onChange={(e) => {
                                            setRowsPerPage(Number(e.target.value));
                                            setCurrentPage(1);
                                        }}
                                        className="border-slate-200 rounded-md text-sm py-1 bg-white"
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-slate-500">
                                        Showing {startIndex + 1}-{Math.min(startIndex + rowsPerPage, cars.length)} of {cars.length}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="w-8 h-8"
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="w-8 h-8"
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>


        </div>
    );
}
