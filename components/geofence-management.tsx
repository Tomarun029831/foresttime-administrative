"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin, Plus, Edit, Trash2, Eye, Navigation } from "lucide-react"
import { mockGeoFences } from "@/lib/mock-data"
import type { GeoFence } from "@/lib/types"

export function GeoFenceManagement() {
  const [geoFences, setGeoFences] = useState<GeoFence[]>(mockGeoFences)
  const [selectedFence, setSelectedFence] = useState<GeoFence | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 35.6762, lng: 139.6503 })
  const [newFencePoints, setNewFencePoints] = useState<{ latitude: number; longitude: number }[]>([])

  // Mock map component - in real implementation, this would be a proper map library
  const MapView = () => (
    <div className="relative w-full h-96 bg-green-100 border-2 border-dashed border-green-300 rounded-lg overflow-hidden">
      {/* Mock map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-emerald-300">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="text-green-600">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute top-4 left-4 space-y-2">
        <Button size="sm" variant="secondary" className="bg-white/90">
          <Navigation className="w-4 h-4" />
        </Button>
        <div className="bg-white/90 p-2 rounded text-xs">
          <div>緯度: {mapCenter.lat.toFixed(4)}</div>
          <div>経度: {mapCenter.lng.toFixed(4)}</div>
        </div>
      </div>

      {/* Existing geofences */}
      {geoFences.map((fence, index) => (
        <div
          key={fence.id}
          className={`absolute border-2 rounded-lg cursor-pointer transition-all ${
            fence.isActive ? "border-green-500 bg-green-500/20" : "border-gray-400 bg-gray-400/20"
          } ${selectedFence?.id === fence.id ? "ring-2 ring-blue-500" : ""}`}
          style={{
            left: `${20 + index * 15}%`,
            top: `${30 + index * 10}%`,
            width: `${fence.radius / 5}px`,
            height: `${fence.radius / 5}px`,
          }}
          onClick={() => setSelectedFence(fence)}
        >
          <div className="absolute -top-6 left-0 text-xs font-medium bg-white px-1 rounded">{fence.name}</div>
        </div>
      ))}

      {/* Center marker */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <MapPin className="w-6 h-6 text-red-500" />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/90 p-3 rounded-lg text-sm">
        <p className="font-medium mb-1">マップ操作:</p>
        <p className="text-xs text-muted-foreground">• エリアをクリックして選択 • 新規作成ボタンで新しいエリアを追加</p>
      </div>
    </div>
  )

  const CreateGeoFenceDialog = () => {
    const [formData, setFormData] = useState({
      name: "",
      description: "",
      radius: 100,
      coordinates: [
        { latitude: 35.6762, longitude: 139.6503 },
        { latitude: 35.6772, longitude: 139.6513 },
        { latitude: 35.6782, longitude: 139.6503 },
        { latitude: 35.6772, longitude: 139.6493 },
      ],
    })

    const handleCreate = () => {
      const newFence: GeoFence = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        coordinates: formData.coordinates,
        radius: formData.radius,
        isActive: true,
        createdAt: new Date(),
      }
      setGeoFences([...geoFences, newFence])
      setIsCreateDialogOpen(false)
      setFormData({
        name: "",
        description: "",
        radius: 100,
        coordinates: [
          { latitude: 35.6762, longitude: 139.6503 },
          { latitude: 35.6772, longitude: 139.6513 },
          { latitude: 35.6782, longitude: 139.6503 },
          { latitude: 35.6772, longitude: 139.6493 },
        ],
      })
    }

    return (
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新しい作業エリアを作成</DialogTitle>
            <DialogDescription>GPS座標を指定して新しいジオフェンス作業エリアを作成します</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">エリア名</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例: 北山作業エリア"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="radius">半径 (メートル)</Label>
                <Input
                  id="radius"
                  type="number"
                  value={formData.radius}
                  onChange={(e) => setFormData({ ...formData, radius: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">説明</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="作業エリアの詳細説明"
              />
            </div>
            <div className="space-y-2">
              <Label>GPS座標 (境界点)</Label>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {formData.coordinates.map((coord, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="緯度"
                      value={coord.latitude}
                      onChange={(e) => {
                        const newCoords = [...formData.coordinates]
                        newCoords[index].latitude = Number(e.target.value)
                        setFormData({ ...formData, coordinates: newCoords })
                      }}
                    />
                    <Input
                      placeholder="経度"
                      value={coord.longitude}
                      onChange={(e) => {
                        const newCoords = [...formData.coordinates]
                        newCoords[index].longitude = Number(e.target.value)
                        setFormData({ ...formData, coordinates: newCoords })
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
                作成
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const toggleFenceStatus = (fenceId: string) => {
    setGeoFences(geoFences.map((fence) => (fence.id === fenceId ? { ...fence, isActive: !fence.isActive } : fence)))
  }

  const deleteFence = (fenceId: string) => {
    setGeoFences(geoFences.filter((fence) => fence.id !== fenceId))
    if (selectedFence?.id === fenceId) {
      setSelectedFence(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">作業エリア管理</h2>
          <p className="text-muted-foreground">ジオフェンス機能で作業エリアを管理します</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              新規エリア作成
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                作業エリアマップ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MapView />
            </CardContent>
          </Card>
        </div>

        {/* Selected Fence Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                選択エリア詳細
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedFence ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedFence.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedFence.description}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">状態:</span>
                      <Badge variant={selectedFence.isActive ? "default" : "secondary"}>
                        {selectedFence.isActive ? "アクティブ" : "非アクティブ"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">半径:</span>
                      <span className="text-sm">{selectedFence.radius}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">境界点数:</span>
                      <span className="text-sm">{selectedFence.coordinates.length}点</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">作成日:</span>
                      <span className="text-sm">{selectedFence.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3 mr-1" />
                      編集
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteFence(selectedFence.id)}>
                      <Trash2 className="w-3 h-3 mr-1" />
                      削除
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>マップ上のエリアを選択してください</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Geofences List */}
      <Card>
        <CardHeader>
          <CardTitle>作業エリア一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>エリア名</TableHead>
                <TableHead>説明</TableHead>
                <TableHead>半径</TableHead>
                <TableHead>状態</TableHead>
                <TableHead>作成日</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {geoFences.map((fence) => (
                <TableRow key={fence.id}>
                  <TableCell className="font-medium">{fence.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{fence.description || "説明なし"}</TableCell>
                  <TableCell>{fence.radius}m</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={fence.isActive} onCheckedChange={() => toggleFenceStatus(fence.id)} />
                      <Badge variant={fence.isActive ? "default" : "secondary"}>
                        {fence.isActive ? "アクティブ" : "非アクティブ"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{fence.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setSelectedFence(fence)}>
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteFence(fence.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateGeoFenceDialog />
    </div>
  )
}
