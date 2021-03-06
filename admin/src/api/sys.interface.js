/*
 * @Author: your name
 * @Date: 2020-02-03 08:30:59
 * @LastEditTime: 2020-02-16 10:45:45
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \admin\src\api\sys.interface.js
 */
import request from '@/plugin/axios'

/**
 * 新建接口
 * @param {*} data 
 */
export function CreateInterface(data) {
    return request({
        url: '/v1/Interface/CreateInterface',
        method: 'post',
        data,
        headers: {isCheck: true}
    })
}

/**
 * 禁用接口
 * @param {*} data 
 */
export function LockInterface(data) {
    return request({
        url: '/v1/Interface/LockInterface',
        method: 'post',
        data,
        headers: {isCheck: true}
    })
}

/**
 * 删除接口
 * @param {*} data 
 */
export function DelInterface(data) {
    return request({
        url: '/v1/Interface/DelInterface',
        method: 'post',
        data,
        headers: {isCheck: true}
    })
}

/**
 * 修改接口信息
 * @param {*} data 
 */
export function ModifyInterface(data) {
    return request({
        url: '/v1/Interface/ModifyInterface',
        method: 'post',
        data,
        headers: {isCheck: true}
    })
}

/**
 * 获取接口列表
 * @param {*} data 
 */
export function QueryInterfaceByParam(data) {
    return request({
        url: '/v1/Interface/QueryInterfaceByParam',
        method: 'post',
        data,
        headers: {isCheck: true}
    })
}