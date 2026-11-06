"""把 LowPoly 小岛改成紫色调 + 淡紫小幽灵（替换皮卡丘）。

用法：
  blender -b --factory-startup --python scripts/blender/build_ghost_world.py
输出：
  design/blender/ghost-world.blend
"""
import math

import bpy
from mathutils import Vector

ROOT = "D:/WebStormProject/MyPersonalWebpage"
SRC = r"C:\Users\Lenovo\OneDrive\Desktop\blender_example\超治愈LowPoly皮卡丘世界\工程文件\方块皮卡丘（材质+动画）.blend"
OUT = f"{ROOT}/design/blender/ghost-world.blend"


def srgb_to_linear(hex_color: str):
    value = hex_color.lstrip("#")
    rgb = [int(value[i:i + 2], 16) / 255.0 for i in (0, 2, 4)]
    return tuple(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb)


def emit_mat(name, color, strength=1.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    out = nodes.new("ShaderNodeOutputMaterial")
    emission = nodes.new("ShaderNodeEmission")
    emission.inputs["Color"].default_value = (*srgb_to_linear(color), 1.0)
    emission.inputs["Strength"].default_value = strength
    mat.node_tree.links.new(emission.outputs["Emission"], out.inputs["Surface"])
    return mat


def ico(location, radius, mat, scale=(1, 1, 1), subdivisions=3):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdivisions, radius=radius, location=location)
    obj = bpy.context.object
    obj.scale = scale
    obj.data.materials.append(mat)
    for poly in obj.data.polygons:
        poly.use_smooth = True
    return obj


def main():
    bpy.ops.wm.open_mainfile(filepath=SRC)
    scene = bpy.context.scene

    # 隐藏皮卡丘整组（Cube.043 是身体，子物体是耳朵/四肢/眼睛）
    root = bpy.data.objects.get("Cube.043")
    hidden = 0
    if root:
        for obj in [root, *list(root.children_recursive)]:
            obj.hide_render = True
            obj.hide_set(True)
            hidden += 1
    print("HIDDEN_PIKA", hidden)

    body_mat = emit_mat("幽灵 · 身体", "#D8CCF4", 0.85)
    eye_mat = emit_mat("幽灵 · 眼睛", "#3A2B55", 1.0)
    blush_mat = emit_mat("幽灵 · 腮红", "#E8B6D9", 0.9)

    pivot = bpy.data.objects.new("GhostPivot", None)
    scene.collection.objects.link(pivot)
    pivot.location = (-0.50, -1.20, 2.85)
    pivot.empty_display_type = "PLAIN_AXES"
    pivot.empty_display_size = 0.2

    def add(obj):
        obj.parent = pivot
        return obj

    # 身体
    add(ico((0, 0, 0.42), 0.50, body_mat, scale=(1.0, 1.0, 1.15), subdivisions=3))
    # 底部波浪
    for i in range(6):
        angle = i * math.tau / 6
        add(ico((math.cos(angle) * 0.30, math.sin(angle) * 0.30, 0.12), 0.17, body_mat, subdivisions=2))
    # 小手臂
    add(ico((0.55, 0, 0.36), 0.15, body_mat, scale=(1.3, 0.75, 0.65), subdivisions=2))
    add(ico((-0.55, 0, 0.36), 0.15, body_mat, scale=(1.3, 0.75, 0.65), subdivisions=2))
    # 眼睛和嘴：朝 -Y
    add(ico((0.16, -0.52, 0.52), 0.06, eye_mat, scale=(0.9, 0.5, 1.2), subdivisions=2))
    add(ico((-0.16, -0.52, 0.52), 0.06, eye_mat, scale=(0.9, 0.5, 1.2), subdivisions=2))
    add(ico((0, -0.53, 0.38), 0.035, eye_mat, scale=(1.4, 0.5, 0.7), subdivisions=2))
    # 腮红
    add(ico((0.30, -0.46, 0.37), 0.045, blush_mat, scale=(1.0, 0.4, 0.8), subdivisions=2))
    add(ico((-0.30, -0.46, 0.37), 0.045, blush_mat, scale=(1.0, 0.4, 0.8), subdivisions=2))

    # 48 帧 / 12fps / 4 秒：幽灵在岛上来回游走，首尾无缝
    scene.frame_start = 1
    scene.frame_end = 48
    scene.render.fps = 12
    for frame in range(1, 49):
        t = (frame - 1) / 48
        x = -0.5 + 0.55 * math.sin(t * math.tau)
        z = 2.85 + 0.05 * math.sin(t * 2 * math.tau)
        rz = 0.08 * math.sin(t * math.tau + 0.4)
        pivot.location = (x, -1.2, z)
        pivot.rotation_euler.z = rz
        pivot.keyframe_insert(data_path="location", frame=frame)
        pivot.keyframe_insert(data_path="rotation_euler", frame=frame)

    # 固定相机（原场景相机挂在旋转圆环上，这里保留第 1 帧机位）
    camera = scene.camera
    camera_world = camera.matrix_world.copy()
    camera.parent = None
    camera.matrix_world = camera_world
    camera.animation_data_clear()

    # 输出设置
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 640
    scene.render.resolution_y = 360
    scene.render.resolution_percentage = 100
    scene.eevee.taa_render_samples = 48
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = True
    scene.render.filepath = f"{ROOT}/design/blender/ghost_frames/frame_"

    # 贴图打包，避免复制 .blend 后相对路径失效
    bpy.ops.file.pack_all()
    bpy.ops.wm.save_as_mainfile(filepath=OUT)
    print("SAVED", OUT)


if __name__ == "__main__":
    main()
