"""生成「四季树」场景：低多边形小岛 + 四色树冠，转台式循环。

用法：
  blender -b --factory-startup --python scripts/blender/build_four_seasons.py

输出：design/blender/four-seasons.blend
"""
import math
import random

import bpy
from mathutils import Vector

SEED = 7
random.seed(SEED)

ROOT = "D:/WebStormProject/MyPersonalWebpage"
BLEND_PATH = f"{ROOT}/design/blender/four-seasons.blend"
FRAME_DIR = f"{ROOT}/design/blender/frames/"

# 站点色盘
CREAM = "#FAF7F4"
TRUNK = "#8A5A44"
GRASS = "#8FB98B"
DIRT = "#A97C5B"
ROCK = "#9B8E9C"
GOLD = "#D9B36C"
SNOW = "#F7FAFC"
SEASONS = {
    "spring": "#F2C3D1",
    "summer": "#9CC9A3",
    "autumn": "#E9B27C",
    "winter": "#D7E5F2",
}


def srgb_to_linear(hex_color: str):
    value = hex_color.lstrip("#")
    rgb = [int(value[i:i + 2], 16) / 255.0 for i in (0, 2, 4)]
    return tuple(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in rgb)


def material(name, color, roughness=0.7, metallic=0.0, emission=None, emission_strength=1.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    linear = srgb_to_linear(color)
    bsdf.inputs["Base Color"].default_value = (*linear, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if emission:
        emit = srgb_to_linear(emission)
        bsdf.inputs["Emission Color"].default_value = (*emit, 1.0)
        bsdf.inputs["Emission Strength"].default_value = emission_strength
    return mat


def flat(obj):
    for poly in obj.data.polygons:
        poly.use_smooth = False


def ico(location, radius, mat, scale=(1, 1, 1), subdivisions=2, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=subdivisions, radius=radius, location=location)
    obj = bpy.context.object
    obj.scale = scale
    obj.rotation_euler = rot
    obj.data.materials.append(mat)
    flat(obj)
    return obj


def cone_between(start, end, r1, r2, mat, vertices=8):
    start, end = Vector(start), Vector(end)
    direction = end - start
    length = direction.length
    mid = (start + end) / 2
    bpy.ops.mesh.primitive_cone_add(
        vertices=vertices, radius1=r1, radius2=r2, depth=length, location=mid
    )
    obj = bpy.context.object
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = direction.to_track_quat("Z", "Y")
    obj.data.materials.append(mat)
    flat(obj)
    return obj


def main():
    # 干净场景
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for collection in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras):
        for item in list(collection):
            if item.users == 0:
                collection.remove(item)

    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.device = "GPU"
    scene.cycles.samples = 32
    scene.cycles.use_denoising = True
    scene.cycles.denoiser = "OPENIMAGEDENOISE"
    scene.cycles.max_bounces = 4
    scene.cycles.caustics_reflective = False
    scene.cycles.caustics_refractive = False
    scene.render.resolution_x = 480
    scene.render.resolution_y = 480
    scene.render.resolution_percentage = 100
    scene.render.fps = 24
    scene.frame_start = 1
    scene.frame_end = 144
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.film_transparent = True
    scene.render.filepath = FRAME_DIR + "frame_"
    scene.view_settings.view_transform = "Standard"
    scene.view_settings.look = "None"
    scene.view_settings.exposure = 0.0

    # 世界：奶油底
    world = bpy.data.worlds.new("Cream World")
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (*srgb_to_linear(CREAM), 1.0)
    bg.inputs["Strength"].default_value = 0.35
    scene.world = world

    # 材质
    mat_trunk = material("Trunk", TRUNK, roughness=0.85)
    mat_grass = material("Grass", GRASS, roughness=0.9)
    mat_dirt = material("Dirt", DIRT, roughness=0.95)
    mat_rock = material("Rock", ROCK, roughness=0.9)
    mat_gold = material("Gold", GOLD, roughness=0.25, metallic=0.9)
    mat_snow = material("Snow", SNOW, roughness=0.6)
    mats = {key: material(key, color, roughness=0.75) for key, color in SEASONS.items()}

    # 转台
    turntable = bpy.data.objects.new("Turntable", None)
    scene.collection.objects.link(turntable)

    # 小岛
    bpy.ops.mesh.primitive_cylinder_add(vertices=14, radius=1.3, depth=0.24, location=(0, 0, 0.02))
    island = bpy.context.object
    island.data.materials.append(mat_dirt)
    flat(island)
    island.parent = turntable

    bpy.ops.mesh.primitive_cylinder_add(vertices=14, radius=1.28, depth=0.06, location=(0, 0, 0.15))
    top = bpy.context.object
    top.data.materials.append(mat_grass)
    flat(top)
    top.parent = turntable
    # 顶面随机起伏
    for vert in top.data.vertices:
        if vert.co.z > 0:
            vert.co.z += random.uniform(-0.02, 0.05)

    # 岛边金环
    bpy.ops.mesh.primitive_torus_add(
        major_radius=1.31, minor_radius=0.012, major_segments=64, minor_segments=8,
        location=(0, 0, 0.12),
    )
    ring = bpy.context.object
    ring.data.materials.append(mat_gold)
    ring.parent = turntable

    # 树干与主枝
    trunk = cone_between((0, 0, 0.14), (0, 0, 1.45), 0.2, 0.08, mat_trunk, 8)
    trunk.parent = turntable

    # 露在外面的树根
    for root_angle in (0.45, 2.1, 3.9, 5.4):
        root = cone_between(
            (0, 0, 0.22),
            (math.cos(root_angle) * 0.42, math.sin(root_angle) * 0.42, 0.18),
            0.065, 0.018, mat_trunk, 6,
        )
        root.parent = turntable

    # 四色树冠：四个方向各一簇
    angles = [0, math.pi / 2, math.pi, 3 * math.pi / 2]
    season_order = ["spring", "summer", "autumn", "winter"]
    for angle, season in zip(angles, season_order):
        cx, cy = math.cos(angle) * 0.52, math.sin(angle) * 0.52
        center = Vector((cx, cy, 1.92))
        # 主枝
        branch = cone_between(
            (0, 0, 1.35), (cx * 0.75, cy * 0.75, 1.68), 0.07, 0.035, mat_trunk, 6
        )
        branch.parent = turntable
        # 叶簇
        for i in range(9):
            offset = Vector((
                random.uniform(-0.34, 0.34),
                random.uniform(-0.34, 0.34),
                random.uniform(-0.22, 0.26),
            ))
            radius = random.uniform(0.25, 0.38)
            scale = (random.uniform(0.95, 1.25), random.uniform(0.95, 1.25), random.uniform(0.75, 1.0))
            blob = ico(center + offset, radius, mats[season], scale=scale, subdivisions=2)
            blob.parent = turntable
        # 顶部再补一团，避免树冠太扁
        top_offset = Vector((random.uniform(-0.12, 0.12), random.uniform(-0.12, 0.12), 0.3))
        top_blob = ico(center + top_offset, random.uniform(0.22, 0.32), mats[season], subdivisions=2)
        top_blob.parent = turntable
        # 冬天的雪帽
        if season == "winter":
            for i in range(2):
                offset = Vector((
                    random.uniform(-0.25, 0.25),
                    random.uniform(-0.25, 0.25),
                    random.uniform(0.2, 0.36),
                ))
                cap = ico(center + offset, random.uniform(0.1, 0.16), mat_snow, subdivisions=1)
                cap.scale = (1.3, 1.3, 0.45)
                cap.parent = turntable

    # 岛上的石头和草
    for i in range(7):
        angle = random.uniform(0, math.tau)
        dist = random.uniform(0.75, 1.15)
        rock = ico(
            (math.cos(angle) * dist, math.sin(angle) * dist, 0.18),
            random.uniform(0.05, 0.11), mat_rock, subdivisions=1,
            scale=(1, 1, random.uniform(0.5, 0.9)),
        )
        rock.parent = turntable

    for i in range(10):
        angle = random.uniform(0, math.tau)
        dist = random.uniform(0.45, 1.1)
        bpy.ops.mesh.primitive_cone_add(
            vertices=4, radius1=0.025, radius2=0.0, depth=random.uniform(0.08, 0.16),
            location=(math.cos(angle) * dist, math.sin(angle) * dist, 0.2),
        )
        grass = bpy.context.object
        grass.data.materials.append(mat_grass)
        grass.rotation_euler = (random.uniform(-0.2, 0.2), random.uniform(-0.2, 0.2), random.uniform(0, math.tau))
        grass.parent = turntable

    # 地面上的季节细节：春瓣、秋叶、冬雪、几朵小花
    mat_petal = material("Petal", "#F2B6C6", roughness=0.7)
    mat_leaf = material("Leaf", "#DE9A5C", roughness=0.8)
    mat_flower_y = material("FlowerYellow", "#F0D48A", roughness=0.7)
    mat_flower_w = material("FlowerWhite", "#FFF6EA", roughness=0.7)

    for i in range(6):
        ico(
            (random.uniform(0.55, 1.05), random.uniform(-0.35, 0.55), 0.195),
            random.uniform(0.035, 0.055), mat_petal,
            scale=(1.0, 0.65, 0.2), subdivisions=1,
        ).parent = turntable
    for i in range(5):
        ico(
            (random.uniform(-1.05, -0.55), random.uniform(-0.3, 0.5), 0.195),
            random.uniform(0.04, 0.06), mat_leaf,
            scale=(1.0, 1.0, 0.16), subdivisions=1,
        ).parent = turntable

    snow_patch = ico((0.15, -0.85, 0.19), 0.36, mat_snow, scale=(1.2, 0.75, 0.08), subdivisions=2)
    snow_patch.parent = turntable

    for i in range(5):
        angle = random.uniform(0, math.tau)
        dist = random.uniform(0.55, 1.0)
        x, y = math.cos(angle) * dist, math.sin(angle) * dist
        stem = cone_between((x, y, 0.18), (x, y, 0.32), 0.008, 0.006, mat_grass, 4)
        stem.parent = turntable
        head = ico((x, y, 0.34), 0.035, mat_flower_y if i % 2 == 0 else mat_flower_w, subdivisions=1)
        head.parent = turntable

    # 灯光：柔和的大面光，全部朝向树心
    def area(name, location, energy, size, color):
        bpy.ops.object.light_add(type="AREA", location=location)
        light = bpy.context.object
        light.name = name
        light.data.energy = energy
        light.data.size = size
        light.data.color = srgb_to_linear(color)
        direction = Vector((0, 0, 1.2)) - Vector(location)
        light.rotation_mode = "QUATERNION"
        light.rotation_quaternion = direction.to_track_quat("-Z", "Y")
        return light

    key = area("Key", (3.4, -3.8, 4.6), 260, 5.0, "#FFF3E4")
    fill = area("Fill", (-4.0, -2.4, 3.2), 60, 4.5, "#E8F0FF")
    rim = area("Rim", (0.5, 4.2, 3.6), 180, 3.5, "#FFE7F0")

    # 相机
    target = bpy.data.objects.new("LookAt", None)
    scene.collection.objects.link(target)
    target.location = (0, 0, 1.35)

    bpy.ops.object.camera_add(location=(3.25, -4.55, 2.75))
    camera = bpy.context.object
    camera.data.lens = 64
    camera.data.sensor_width = 36
    camera.data.dof.use_dof = True
    camera.data.dof.focus_object = target
    camera.data.dof.aperture_fstop = 4.0
    constraint = camera.constraints.new(type="TRACK_TO")
    constraint.target = target
    constraint.track_axis = "TRACK_NEGATIVE_Z"
    constraint.up_axis = "UP_Y"
    scene.camera = camera

    # 转台 360° / 6 秒，线性，首尾相接
    turntable.rotation_euler = (0, 0, -math.pi / 2)
    turntable.keyframe_insert(data_path="rotation_euler", frame=1)
    turntable.rotation_euler = (0, 0, -math.pi / 2 + math.tau)
    turntable.keyframe_insert(data_path="rotation_euler", frame=145)
    for fcurve in turntable.animation_data.action.fcurves:
        for keyframe in fcurve.keyframe_points:
            keyframe.interpolation = "LINEAR"

    # GPU 设备
    prefs = bpy.context.preferences.addons["cycles"].preferences
    prefs.compute_device_type = "OPTIX"
    prefs.get_devices()
    for device in prefs.devices:
        device.use = device.type == "OPTIX"

    bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
    print("SAVED", BLEND_PATH)


if __name__ == "__main__":
    main()

