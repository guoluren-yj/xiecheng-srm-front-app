import { http } from "srm-mobile-ui";

const storage = window.localStorage;

// 获取 基本信息 问题描述 小组成员
export const getProblemHeader = (id, params) => http.get(`/sqam/v1/${storage.getItem("organizationId")}/problem-headers/${id}/detail`, { params });

// 获取 关联整改报告
export const getProblemAssociates = (id, params) => http.get(`/sqam/v1/${storage.getItem("organizationId")}/header-associates/${id}/assocaite`, { params });

// 获取 关联订单
export const getEdProblemRelationPos = (id, params) => http.get(`/sqam/v1/${storage.getItem("organizationId")}/ed-problem-relation-pos/${id}/query`, { params });

// 获取 质量检验单
export const getProblemInspections = (id, params) => http.get(`/sqam/v1/${storage.getItem("organizationId")}/ed-problem-inspections/${id}`, { params });

// 获取 质检事务
export const getProblemControls = (params) => http.get(`/spuc/v1/${storage.getItem("organizationId")}/sinv/rcv/trx/header/finish/line`, { params });
