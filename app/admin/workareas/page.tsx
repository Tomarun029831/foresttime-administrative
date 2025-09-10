"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Plus, Edit2, Trash2, Save, RotateCcw } from "lucide-react"

interface WorkAreaManagementProps {
    onNavigate: (screen: Screen) => void
}

interface GeoFence {
    id: string
    name: string
    coordinates: Array<{ lat: number; lng: number }>
    description: string
    color: string
}

export default function WorkAreaManagement({ onNavigate }: WorkAreaManagementProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const [areas, setAreas] = useState<GeoFence[]>([
        {
            id: "1",
            name: "山林A区域",
            coordinates: [
                { lat: 35.6762, lng: 139.6503 },
                { lat: 35.6762, lng: 139.6603 },
                { lat: 35.6862, lng: 139.6603 },
                { lat: 35.6862, lng: 139.6503 },
            ],
            description: "杉林の間伐作業エリア",
            color: "#3b82f6",
        },
        {
            id: "2",
            name: "山林B区域",
            coordinates: [
                { lat: 35.6962, lng: 139.6403 },
                { lat: 35.6962, lng: 139.6503 },
                { lat: 35.7062, lng: 139.6503 },
                { lat: 35.7062, lng: 139.6403 },
            ],
            description: "ヒノキの植林エリア",
            color: "#10b981",
        },
    ])

    const [showForm, setShowForm] = useState(false)
    const [isDrawing, setIsDrawing] = useState(false)
    const [currentPolygon, setCurrentPolygon] = useState<Array<{ lat: number; lng: number }>>([])
    const [newArea, setNewArea] = useState({
        name: "",
        description: "",
    })

    // Map bounds (simulating a local area in Japan)
    const mapBounds = {
        north: 35.72,
        south: 35.64,
        east: 139.68,
        west: 139.62,
    }

    const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

    const handleMapMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.button === 2) {
            // Right click only for panning
            setIsDragging(true)
            setDragStart({ x: event.clientX - mapOffset.x, y: event.clientY - mapOffset.y })
            event.preventDefault()
        }
    }

    const handleMapMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging) {
            const newOffset = {
                x: event.clientX - dragStart.x,
                y: event.clientY - dragStart.y,
            }
            setMapOffset(newOffset)
        }
    }

    const handleMapMouseUp = () => {
        setIsDragging(false)
    }

    const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!isDrawing || !mapRef.current) return

        const rect = mapRef.current.getBoundingClientRect()
        const coordinate = screenToLatLng(event.clientX, event.clientY, rect)

        setCurrentPolygon([...currentPolygon, coordinate])
    }

    const screenToLatLng = (x: number, y: number, rect: DOMRect) => {
        const adjustedX = x - rect.left - mapOffset.x
        const adjustedY = y - rect.top - mapOffset.y

        const relativeX = adjustedX / rect.width
        const relativeY = adjustedY / rect.height

        const lng = mapBounds.west + (mapBounds.east - mapBounds.west) * relativeX
        const lat = mapBounds.north - (mapBounds.north - mapBounds.south) * relativeY

        return { lat: Math.round(lat * 1000000) / 1000000, lng: Math.round(lng * 1000000) / 1000000 }
    }

    const latLngToScreen = (lat: number, lng: number, width: number, height: number) => {
        const x = ((lng - mapBounds.west) / (mapBounds.east - mapBounds.west)) * width + mapOffset.x
        const y = ((mapBounds.north - lat) / (mapBounds.north - mapBounds.south)) * height + mapOffset.y
        return { x: Math.round(x), y: Math.round(y) }
    }

    const startDrawing = () => {
        setIsDrawing(true)
        setCurrentPolygon([])
        setShowForm(true)
    }

    const finishDrawing = () => {
        if (currentPolygon.length < 3) {
            alert("GeoFenceを作成するには最低3点が必要です")
            return
        }
        setIsDrawing(false)
    }

    const resetDrawing = () => {
        setCurrentPolygon([])
        setIsDrawing(false)
    }

    const handleSaveArea = () => {
        if (!newArea.name || currentPolygon.length < 3) {
            alert("エリア名と最低3点の座標が必要です")
            return
        }

        const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]
        const area: GeoFence = {
            id: Date.now().toString(),
            name: newArea.name,
            description: newArea.description,
            coordinates: currentPolygon,
            color: colors[areas.length % colors.length],
        }

        setAreas([...areas, area])
        setNewArea({ name: "", description: "" })
        setCurrentPolygon([])
        setShowForm(false)
        setIsDrawing(false)
    }

    const handleDeleteArea = (id: string) => {
        if (confirm("このエリアを削除しますか？")) {
            setAreas(areas.filter((area) => area.id !== id))
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-600 rounded-lg p-2">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <h1 className="text-xl font-semibold">作業エリア管理</h1>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Button onClick={startDrawing} className="bg-blue-600 hover:bg-blue-700" disabled={isDrawing}>
                                <Plus className="w-4 h-4 mr-2" />
                                新しいエリアを作成
                            </Button>
                            {isDrawing && (
                                <>
                                    <Button onClick={finishDrawing} variant="outline">
                                        <Save className="w-4 h-4 mr-2" />
                                        描画完了
                                    </Button>
                                    <Button onClick={resetDrawing} variant="outline">
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        リセット
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Interactive Map */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Map Area */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>作業エリア地図</span>
                                    {isDrawing && <Badge className="bg-orange-600">描画モード（左クリックで点を追加）</Badge>}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {isDrawing
                                        ? "左クリックでGeoFenceの境界点を設定、右クリック&ドラッグで地図を移動"
                                        : "右クリック&ドラッグで地図を移動できます。登録済みの作業エリアが表示されています"}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div
                                    ref={mapRef}
                                    className={`relative w-full h-96 bg-green-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden select-none ${isDrawing ? "cursor-crosshair" : isDragging ? "cursor-grabbing" : "cursor-grab"
                                        }`}
                                    onMouseDown={handleMapMouseDown}
                                    onMouseMove={handleMapMouseMove}
                                    onMouseUp={handleMapMouseUp}
                                    onMouseLeave={handleMapMouseUp}
                                    onClick={handleMapClick}
                                    onContextMenu={(e) => e.preventDefault()} // Prevent context menu on right click
                                    style={{
                                        backgroundImage: `
                      linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px),
                      linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)
                    `,
                                        backgroundSize: "20px 20px",
                                        backgroundPosition: `${mapOffset.x}px ${mapOffset.y}px`,
                                    }}
                                >
                                    {/* Render existing areas */}
                                    {areas.map((area) => {
                                        if (!mapRef.current) return null
                                        const rect = mapRef.current.getBoundingClientRect()
                                        const width = rect.width || 600
                                        const height = rect.height || 384

                                        const points = area.coordinates.map((coord) => latLngToScreen(coord.lat, coord.lng, width, height))

                                        const pathData =
                                            points.reduce((path, point, index) => {
                                                return path + (index === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`)
                                            }, "") + " Z"

                                        return (
                                            <svg key={area.id} className="absolute inset-0 w-full h-full pointer-events-none">
                                                <path d={pathData} fill={area.color + "40"} stroke={area.color} strokeWidth="2" />
                                                {points.map((point, index) => (
                                                    <circle key={index} cx={point.x} cy={point.y} r="4" fill={area.color} />
                                                ))}
                                            </svg>
                                        )
                                    })}

                                    {/* Render current polygon being drawn */}
                                    {currentPolygon.length > 0 && mapRef.current && (
                                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                            {currentPolygon.map((coord, index) => {
                                                const rect = mapRef.current!.getBoundingClientRect()
                                                const point = latLngToScreen(coord.lat, coord.lng, rect.width, rect.height)
                                                return <circle key={index} cx={point.x} cy={point.y} r="4" fill="#ef4444" />
                                            })}
                                            {currentPolygon.length > 1 && (
                                                <path
                                                    d={currentPolygon.reduce((path, coord, index) => {
                                                        const rect = mapRef.current!.getBoundingClientRect()
                                                        const point = latLngToScreen(coord.lat, coord.lng, rect.width, rect.height)
                                                        return path + (index === 0 ? `M ${point.x},${point.y}` : ` L ${point.x},${point.y}`)
                                                    }, "")}
                                                    fill="none"
                                                    stroke="#ef4444"
                                                    strokeWidth="2"
                                                    strokeDasharray="5,5"
                                                />
                                            )}
                                        </svg>
                                    )}

                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-600 shadow-lg">
                                        <div className="space-y-1">
                                            <div>🖱️ 右クリック&ドラッグ: 地図移動</div>
                                            {isDrawing && <div>👆 左クリック: 点を配置</div>}
                                        </div>
                                    </div>
                                </div>

                                {isDrawing && currentPolygon.length > 0 && (
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm">設定済み座標点: {currentPolygon.length}点</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            最新の点: {currentPolygon[currentPolygon.length - 1]?.lat.toFixed(6)},{" "}
                                            {currentPolygon[currentPolygon.length - 1]?.lng.toFixed(6)}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Form Panel */}
                    {showForm && (
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle>エリア詳細設定</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="areaName">エリア名 *</Label>
                                        <Input
                                            id="areaName"
                                            placeholder="例: 山林C区域"
                                            value={newArea.name}
                                            onChange={(e) => setNewArea({ ...newArea, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="areaDescription">説明</Label>
                                        <Input
                                            id="areaDescription"
                                            placeholder="例: 松林の伐採エリア"
                                            value={newArea.description}
                                            onChange={(e) => setNewArea({ ...newArea, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="text-sm text-muted-foreground">
                                        座標点数: {currentPolygon.length}点
                                        {currentPolygon.length < 3 && <p className="text-red-600 mt-1">※ 最低3点が必要です</p>}
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <Button
                                            onClick={handleSaveArea}
                                            className="bg-blue-600 hover:bg-blue-700"
                                            disabled={!newArea.name || currentPolygon.length < 3}
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            エリアを保存
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowForm(false)
                                                setIsDrawing(false)
                                                setCurrentPolygon([])
                                                setNewArea({ name: "", description: "" })
                                            }}
                                        >
                                            キャンセル
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Areas List */}
                <div className="space-y-6">
                    <h2 className="text-2xl">登録済み作業エリア</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {areas.map((area) => (
                            <Card key={area.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="flex items-center space-x-2">
                                                <MapPin className="w-5 h-5 text-blue-600" />
                                                <span>{area.name}</span>
                                            </CardTitle>
                                            <p className="text-muted-foreground mt-1">{area.description}</p>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Button variant="ghost" size="sm">
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteArea(area.id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-medium mb-2 flex items-center space-x-2">
                                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: area.color }}></div>
                                                <span>座標点</span>
                                            </h4>
                                            <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                                                {area.coordinates.map((coord, index) => (
                                                    <div key={index} className="text-sm text-muted-foreground">
                                                        点{index + 1}: {coord.lat.toFixed(6)}, {coord.lng.toFixed(6)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t">
                                            <p className="text-sm text-muted-foreground">
                                                ID: {area.id} | 座標点数: {area.coordinates.length}点
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {areas.length === 0 && (
                        <Card>
                            <CardContent className="text-center py-12">
                                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">作業エリアが登録されていません</h3>
                                <p className="text-muted-foreground mb-4">
                                    新しい作業エリアを追加して、位置情報ベースの勤怠管理を開始しましょう
                                </p>
                                <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                                    <Plus className="w-4 h-4 mr-2" />
                                    最初のエリアを追加
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
