const DB = require('../middlewares/database')
const RoutePlanning = require('../util/RoutePlanning')

const buildingNodeLinkedMapCache = {}

const getLinksInBuilding = async buildingId => {
    return (
        DB('indoor_link')
        .select('link_id', 'snode_id', 'enode_id', DB.raw('astext(indoor_link.geometry) as geometry'), 'direction', 'length')
        .innerJoin('indoor_floor', 'indoor_link.fl_id', 'indoor_floor.fl_id')
        .where('indoor_floor.building_id', buildingId)
        .then(res => {
            return res
        })
    )
}

const getBuildingNodeLinkedMap = async buildingId => {
    const nodeLinkedMap = buildingNodeLinkedMapCache[buildingId]
    if (nodeLinkedMap) {
        return Promise.resolve(nodeLinkedMap)
    } else {
        return getLinksInBuilding(buildingId).then(res => {
            buildingNodeLinkedMapCache[buildingId] = RoutePlanning.initNodeLinkedMap(res)

            return buildingNodeLinkedMapCache[buildingId]
        })
    }
}

module.exports = {
    getBuildings: async ctx => {
        const name = ctx.query.name || ''

        return DB('indoor_building')
            .select('building_id', 'kind', 'c_name as name', 'address', 'center_coordinate')
            .where('c_name', 'like', '%' + name + '%')
            .then(res => {
                ctx.state.data = res
            })
    },
    getBuildingById: async (ctx) => {
        const id = ctx.params.id

        getBuildingNodeLinkedMap(id)

        return DB('indoor_building')
            .select('building_id', 'kind', 'c_name as name', DB.raw('astext(geometry) as geometry'), 'center_coordinate', 'indoor_floor.fl_id as default_fl_id', 'parking')
            .leftJoin('indoor_floor', function () {
                this.on('indoor_building.building_id', '=', 'indoor_floor.building_id').andOn('indoor_building.default_fl', '=', 'indoor_floor.fl_num')
            })
            .where('building_id', id)
            .then(res => {
                ctx.state.data = res
            })
    },
    getFloorsInBuilding: async (ctx) => {
        const buildingId = ctx.params.buildingId

        return DB('indoor_floor')
            .select('fl_id', 'fl_name', 'fl_num', 'fl_infor', DB.raw('astext(geometry) as geometry'))
            .where('building_id', buildingId)
            .then(res => {
                ctx.state.data = res
            })
    },
    getFacesOnFloor: async (ctx) => {
        const floorId = ctx.params.floorId

        return DB('indoor_face')
            .select('indoor_face.face_id', DB.raw('astext(indoor_face.geometry) as geometry'), 'indoor_poi.poi_id', 'indoor_poi.kind as poi_kind')
            .leftJoin('indoor_poi', 'indoor_face.face_id', 'indoor_poi.face_id')
            .where('indoor_poi.fl_id', floorId)
            // .limit(10)
            .then(res => {
                ctx.state.data = res
            })
    },
    getLinksOnFloor: async ctx => {
        const floorId = ctx.params.floorId
        const param = {}
        if (ctx.query.type) {
            param.type = ctx.query.type
        }
        if (ctx.query.kind) {
            param.kind = ctx.query.kind
        }

        return DB('indoor_link')
            .select('link_id', 'snode_id', 'enode_id', 'direction', DB.raw('astext(geometry) as geometry'), 'kind', 'type', 'emergencyaccess', 'is_wheelchair')
            .where('fl_id', floorId)
            .andWhere(param)
            // .limit(10)
            .then(res => {
                ctx.state.data = res
            })
    },
    getNodesOnFloor: async (ctx) => {
        const floorId = ctx.params.floorId
        const param = {}
        if (ctx.query.kind) {
            param.kind = ctx.query.kind
        }

        return DB('indoor_node')
            .select('node_id', DB.raw('astext(geometry) as geometry'), 'kind', 'face_id', 'connect_node')
            .where('fl_id', floorId)
            .andWhere(param)
            // .limit(10)
            .then(res => {
                ctx.state.data = res
            })
    },
    getPoisOnFloor: async (ctx) => {
        const floorId = ctx.params.floorId

        return DB('indoor_poi')
            .select('poi_id', 'kind', 'c_name as name', DB.raw('astext(geometry) as geometry'), 'face_id')
            .where('fl_id', floorId)
            // .limit(10)
            .then(res => {
                ctx.state.data = res
            })
    },
    getPoiById: async (ctx) => {
        const poiId = ctx.params.id

        return DB('indoor_poi')
            .select('poi_id', 'indoor_poi.kind', 'c_name as name', 'address', 'indoor_poi.face_id', 'indoor_node.node_id')
            .innerJoin('indoor_node', 'indoor_node.face_id', 'indoor_poi.face_id')
            .where('poi_id', poiId)
            .then(res => {
                ctx.state.data = res
            })
    },
    getPoisByTip: async (ctx) => {
        const buildingId = ctx.query.buildingId || 0
        const tip = ctx.query.tip || ''

        return DB('indoor_poi')
            .select('poi_id', 'kind', 'c_name as name', 'address')
            .innerJoin('indoor_floor', 'indoor_poi.fl_id', 'indoor_floor.fl_id')
            .where('indoor_floor.building_id', buildingId)
            .andWhere('indoor_poi.c_name', 'like', '%' + tip + '%')
            .then(res => {
                ctx.state.data = res
            })
    },
    getClosestRoute: async (ctx) => {
        const buildingId = ctx.query.buildingId || 0
        const sNodeId = ctx.query.sNodeId || 0
        const eNodeId = ctx.query.eNodeId || 0

        return getBuildingNodeLinkedMap(buildingId).then(data => {
            ctx.state.data = RoutePlanning.calcRoute(sNodeId, eNodeId, data)
        })
    }
}
