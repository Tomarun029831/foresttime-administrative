"use client"
export const dynamic = "force-dynamic"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Plus, Edit2, Trash2, Save, RotateCcw } from "lucide-react"
import { CircularGeoFence } from "@/lib/types"

interface WorkAreaManagementUIProps { fetchedAreas?: CircularGeoFence[]; }
export default function WorkAreaManagementUI({ fetchedAreas = [], }: WorkAreaManagementUIProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const [areas, setAreas] = useState<CircularGeoFence[]>(fetchedAreas);

    const [showForm, setShowForm] = useState(false)
    const [isSettingCenter, setIsSettingCenter] = useState(false)
    const [tempCenter, setTempCenter] = useState<{ lat: number; lng: number } | null>(null)
    const [newArea, setNewArea] = useState({
        name: "",
        description: "",
        radius: 100,
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
        if (!isSettingCenter || !mapRef.current) return

        const rect = mapRef.current.getBoundingClientRect()
        const center = screenToLatLng(event.clientX, event.clientY, rect)

        setTempCenter(center)
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

    // Convert meters to screen pixels (rough approximation)
    const metersToPixels = (meters: number, lat: number, mapWidth: number) => {
        // Approximate meters per degree at given latitude
        const metersPerDegreeLng = 111320 * Math.cos((lat * Math.PI) / 180)
        const degreesPerMeter = 1 / metersPerDegreeLng
        const mapDegreesWidth = mapBounds.east - mapBounds.west
        const pixelsPerDegree = mapWidth / mapDegreesWidth
        return meters * degreesPerMeter * pixelsPerDegree
    }

    const startSettingCenter = () => {
        setIsSettingCenter(true)
        setTempCenter(null)
        setShowForm(true)
    }

    const finishSettingCenter = () => {
        if (!tempCenter) {
            alert("中心点を設定してください")
            return
        }
        setIsSettingCenter(false)
    }

    const resetSetting = () => {
        setTempCenter(null)
        setIsSettingCenter(false)
        setNewArea({ name: "", description: "", radius: 100 })
    }

    const pushNewAreaToDatabase = (area: CircularGeoFence) => {
        const res = fetch('/api/addArea', {
            method: 'POST',
            cache: 'no-store',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(area)
        })
    }

    const deleteAreaToDatabase = (areaId: string) => {
        const res = fetch('/api/deleteArea', {
            method: 'POST',
            cache: 'no-store',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 'areaId': areaId })
        })
    }

    const handleSaveArea = () => {
        if (!newArea.name || !tempCenter || newArea.radius <= 0) {
            alert("エリア名、中心点、半径（1m以上）が必要です")
            return
        }

        const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]
        const area: CircularGeoFence = {
            id: Date.now().toString(),
            name: newArea.name,
            description: newArea.description,
            center: tempCenter,
            radius: newArea.radius,
            color: colors[areas.length % colors.length],
        }
        pushNewAreaToDatabase(area);

        setAreas([...areas, area])
        setNewArea({ name: "", description: "", radius: 100 })
        setTempCenter(null)
        setShowForm(false)
        setIsSettingCenter(false)
    }

    const handleDeleteArea = (id: string) => {
        if (confirm("このエリアを削除しますか？")) {
            setAreas(areas.filter((area) => area.id !== id))
            deleteAreaToDatabase(id);
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
                                <h1 className="text-xl font-semibold">作業エリア管理（円形）</h1>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Button onClick={startSettingCenter} className="bg-blue-600 hover:bg-blue-700" disabled={isSettingCenter}>
                                <Plus className="w-4 h-4 mr-2" />
                                新しいエリアを作成
                            </Button>
                            {isSettingCenter && (
                                <>
                                    <Button onClick={finishSettingCenter} variant="outline" disabled={!tempCenter}>
                                        <Save className="w-4 h-4 mr-2" />
                                        中心点設定完了
                                    </Button>
                                    <Button onClick={resetSetting} variant="outline">
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
                                    {isSettingCenter && <Badge className="bg-orange-600">中心点設定モード（左クリックで中心点を設定）</Badge>}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {isSettingCenter
                                        ? "左クリックでエリアの中心点を設定、右クリック&ドラッグで地図を移動"
                                        : "右クリック&ドラッグで地図を移動できます。登録済みの円形作業エリアが表示されています"}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div
                                    ref={mapRef}
                                    className={`relative w-full h-96 bg-green-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden select-none ${isSettingCenter ? "cursor-crosshair" : isDragging ? "cursor-grabbing" : "cursor-grab"
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

                                        const center = latLngToScreen(area.center.lat, area.center.lng, width, height)
                                        const radiusPixels = metersToPixels(area.radius, area.center.lat, width)

                                        return (
                                            <svg key={area.id} className="absolute inset-0 w-full h-full pointer-events-none">
                                                {/* Circle */}
                                                <circle
                                                    cx={center.x}
                                                    cy={center.y}
                                                    r={radiusPixels}
                                                    fill={area.color + "20"}
                                                    stroke={area.color}
                                                    strokeWidth="2"
                                                />
                                                {/* Center point */}
                                                <circle cx={center.x} cy={center.y} r="6" fill={area.color} />
                                                {/* Label */}
                                                <text
                                                    x={center.x}
                                                    y={center.y - radiusPixels - 10}
                                                    textAnchor="middle"
                                                    fill={area.color}
                                                    fontSize="12"
                                                    fontWeight="bold"
                                                >
                                                    {area.name}
                                                </text>
                                            </svg>
                                        )
                                    })}

                                    {/* Render temporary center point */}
                                    {tempCenter && mapRef.current && (
                                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                            {(() => {
                                                const rect = mapRef.current!.getBoundingClientRect()
                                                const center = latLngToScreen(tempCenter.lat, tempCenter.lng, rect.width, rect.height)
                                                const radiusPixels = metersToPixels(newArea.radius, tempCenter.lat, rect.width)
                                                return (
                                                    <>
                                                        {/* Preview circle */}
                                                        <circle
                                                            cx={center.x}
                                                            cy={center.y}
                                                            r={radiusPixels}
                                                            fill="rgba(239, 68, 68, 0.1)"
                                                            stroke="#ef4444"
                                                            strokeWidth="2"
                                                            strokeDasharray="5,5"
                                                        />
                                                        {/* Center point */}
                                                        <circle cx={center.x} cy={center.y} r="6" fill="#ef4444" />
                                                    </>
                                                )
                                            })()}
                                        </svg>
                                    )}

                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-600 shadow-lg">
                                        <div className="space-y-1">
                                            <div>🖱️ 右クリック&ドラッグ: 地図移動</div>
                                            {isSettingCenter && <div>👆 左クリック: 中心点を設定</div>}
                                        </div>
                                    </div>
                                </div>

                                {tempCenter && (
                                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm">設定済み中心点: {tempCenter.lat.toFixed(6)}, {tempCenter.lng.toFixed(6)}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            半径: {newArea.radius}m
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
                                    <div className="space-y-2">
                                        <Label htmlFor="radius">半径（メートル） *</Label>
                                        <Input
                                            id="radius"
                                            type="number"
                                            min="1"
                                            placeholder="100"
                                            value={newArea.radius}
                                            onChange={(e) => setNewArea({ ...newArea, radius: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>

                                    <div className="text-sm text-muted-foreground">
                                        {tempCenter ? (
                                            <div className="text-green-600">
                                                ✓ 中心点設定済み
                                                <br />
                                                座標: {tempCenter.lat.toFixed(6)}, {tempCenter.lng.toFixed(6)}
                                            </div>
                                        ) : (
                                            <p className="text-orange-600">※ 地図上で中心点をクリックしてください</p>
                                        )}
                                    </div>

                                    <div className="flex flex-col space-y-2">
                                        <Button
                                            onClick={handleSaveArea}
                                            className="bg-blue-600 hover:bg-blue-700"
                                            disabled={!newArea.name || !tempCenter || newArea.radius <= 0}
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            エリアを保存
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowForm(false)
                                                setIsSettingCenter(false)
                                                setTempCenter(null)
                                                setNewArea({ name: "", description: "", radius: 100 })
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
                                                <span>エリア情報</span>
                                            </h4>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <div className="text-sm text-muted-foreground space-y-1">
                                                    <div>中心座標: {area.center.lat.toFixed(6)}, {area.center.lng.toFixed(6)}</div>
                                                    <div>半径: {area.radius}m</div>
                                                    <div>面積: 約{Math.round(Math.PI * Math.pow(area.radius, 2))}㎡</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t">
                                            <p className="text-sm text-muted-foreground">
                                                ID: {area.id}
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
                                    新しい円形作業エリアを追加して、位置情報ベースの勤怠管理を開始しましょう
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
