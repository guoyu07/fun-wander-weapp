const DB = require('../middlewares/database')

module.exports = {
    getBuildings: async ctx => {
        const name = ctx.query.name || ''

        return DB('indoor_building')
            .select('building_id as id', 'kind', 'c_name as name', 'address', 'center_coordinate')
            .where('c_name', 'like', '%' + name + '%')
            .then(res => {
                ctx.state.data = res
            })
    },
    getBuildingById: async (ctx) => {
        const id = ctx.params.id

        return DB('indoor_building')
            .select('building_id as id', 'kind', 'c_name as name', DB.raw('astext(geometry) as geometry'), 'center_coordinate', 'default_fl', 'parking')
            .where('building_id', id)
            .then(res => {
                ctx.state.data = res
            })
    },
    getFloorsInBuilding: async (ctx) => {
        const buildingId = ctx.params.buildingId

        return DB('indoor_floor')
            .select('fl_id as id', 'fl_name', 'fl_num', 'fl_infor', DB.raw('astext(geometry) as geometry'))
            .where('building_id', buildingId)
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
            .select('node_id as id', DB.raw('astext(geometry) as geometry'), 'kind', 'face_id', 'connect_node')
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
            .select('poi_id as id', 'kind', 'c_name as name', DB.raw('astext(geometry) as geometry'), 'face_id')
            .where('fl_id', floorId)
            // .limit(10)
            .then(res => {
                ctx.state.data = res
            })
    },
    getPoiFacesOnFloor: async (ctx) => {
        const floorId = ctx.params.floorId

        return DB('indoor_poi')
            .select('indoor_poi.poi_id as id', 'indoor_poi.kind', 'indoor_poi.c_name as name', 'indoor_face.face_id', DB.raw('astext(indoor_face.geometry) as geometry'))
            .innerJoin('indoor_face', 'indoor_poi.face_id', 'indoor_face.face_id')
            .where('indoor_poi.fl_id', floorId)
            // .limit(10)
            .then(res => {
                ctx.state.data = res
            })
    }
}
