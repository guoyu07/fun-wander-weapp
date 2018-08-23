/**
 * 路径规划算法类
 */

/**
 * 根据link的起终点列表，初始化点与点的可通行路径的Map对象
 * 双方向link上的两个点记为两条连通路径
 * @param  {Array} linkList link列表
 * @return {Object}         node连通图对象
 */
const initNodeLinkedMap = function (linkList) {
    const nodeLinkedMap = {}

    for (const item of linkList) {
        // 双方向和顺方向link
        if (item.direction === '01' || item.direction === '02') {
            let linkNodeArr = nodeLinkedMap[item.snode_id]
            if (!linkNodeArr) {
                linkNodeArr = []
                nodeLinkedMap[item.snode_id] = linkNodeArr
            }
            linkNodeArr.push({
                nodeId: item.enode_id,
                preLink: item
            })
        }

        // 双方向和顺方向link
        if (item.direction === '01' || item.direction === '03') {
            let linkNodeArr = nodeLinkedMap[item.enode_id]
            if (!linkNodeArr) {
                linkNodeArr = []
                nodeLinkedMap[item.enode_id] = linkNodeArr
            }
            linkNodeArr.push({
                nodeId: item.snode_id,
                preLink: item
            })
        }
    }

    return nodeLinkedMap
}

/**
 * 判断是否可按最短路径，且无环形路径的原则通行到挂接的node点
 * @param  {Object} curPrelinkedNode  当前的有前向连通信息的点对象
 * @param  {Object} linkNode          挂接在当前点对象上的一条LinkNode对象
 * @param  {Object}  prelinkedNodeMap 当前全部的有前向连通信息的点对象的集合
 * @return {Boolean}                  是否可通行
 */
const isValid = function (curPrelinkedNode, linkNode, prelinkedNodeMap) {
    const oPrelinkedNode = prelinkedNodeMap[linkNode.nodeId]
    if (oPrelinkedNode) {
        let preNode = curPrelinkedNode.preNode
        // 处理环形路径
        while (preNode) {
            if (preNode.nodeId === linkNode.nodeId) {
                return false
            }

            preNode = preNode.preNode
        }

        // 计算路径长度，优先选择短的路径
        if ((curPrelinkedNode.distance + linkNode.preLink.length) >= oPrelinkedNode.distance) {
            return false
        }
    }

    return true
}

/**
 * 创建有前向连通信息的点对象
 * @param  {Object} curPrelinkedNode 当前的有前向连通信息的点对象
 * @param  {Object} linkNode         挂接在当前点对象上的一条LinkNode对象
 * @return {Object}                  挂接在当前点对象上的一个Node的有前向连通信息点对象
 */
const createPrelinkedNode = function (curPrelinkedNode, linkNode) {
    return {
        nodeId: linkNode.nodeId,
        preNode: curPrelinkedNode,
        preLink: linkNode.preLink,
        distance: curPrelinkedNode.distance + linkNode.preLink.length
    }
}

/**
 * 以一个点为起点，递归建立有前向连通信息的点对象的集合
 * @param {Object} curNode          当前的有前向连通信息的点对象
 * @param {Object} prelinkedNodeMap 当前全部的有前向连通信息的点对象的集合
 * @param {Object} nodeLinkedMap    node连通图对象
 */
const setNextPrelinkedNode = function (curPrelinkedNode, prelinkedNodeMap = {}, nodeLinkedMap = {}) {
    const linkNodeArr = nodeLinkedMap[curPrelinkedNode.nodeId]
    for (const item of linkNodeArr) {
        if (isValid(curPrelinkedNode, item, prelinkedNodeMap)) {
            const nextNode = createPrelinkedNode(curPrelinkedNode, item)
            prelinkedNodeMap[nextNode.nodeId] = nextNode

            setNextPrelinkedNode(nextNode, prelinkedNodeMap, nodeLinkedMap)
        }
    }
}

/**
 * 以一个点为起点，建立有前向连通信息的点对象的集合
 * @param {Object} sNodeId        起点的Id
 * @param {Object} nodeLinkedMap  node连通图对象
 * @return {Object}               有前向连通信息的点对象的集合
 */
const buildPrelinkedNodeMap = function (sNodeId, nodeLinkedMap) {
    const nodeMap = {}
    const rootNode = {
        nodeId: sNodeId,
        preNode: null,
        preLink: null,
        distance: 0
    }

    nodeMap[rootNode.nodeId] = rootNode
    setNextPrelinkedNode(rootNode, nodeMap, nodeLinkedMap)

    return nodeMap
}

/**
 * 计算两个node点之间的最短通行路径
 * @param  {Number} sNodeId       起点Node的Id
 * @param  {Number} eNodeId       终点Node的Id
 * @param  {Object} nodeLinkedMap node连通图对象
 * @return {Array}                可通行路径的link数组
 */
const calcRoute = function (sNodeId, eNodeId, nodeLinkedMap) {
    const prelinkedNodeMap = buildPrelinkedNodeMap(sNodeId, nodeLinkedMap)

    let curNode = prelinkedNodeMap[eNodeId]
    const routeLinks = []
    while (curNode && curNode.preLink) {
        routeLinks.push(curNode.preLink)

        curNode = curNode.preNode
    }

    return routeLinks.reverse()
}

module.exports = {
    initNodeLinkedMap,
    calcRoute
}
