/// <reference path='../../../@types/index'/>

export * from '@cocos/creator-types/editor/packages/builder/@types/protected';
import { IInternalBuildOptions, IPolyFills, ISettings } from '@cocos/creator-types/editor/packages/builder/@types/protected';

export type IOrientation = 'landscape' | 'portrait';

export interface ITaskOption extends IInternalBuildOptions {
    packages: {
        'taobao-mini-game': {
            appid: string;
            deviceOrientation: IOrientation;
            globalVariable: string;
            separateEngine: boolean;
            wasmSubpackage: boolean;
        };
    };
}

// TODO 需要更新 editor 接口定义
export type IModules = Record<string, IModuleItem>;

export interface IFlagBaseItem {
    /**
     * Display text.
     */
    label: string;

    /**
     * Description.
     */
    description?: string;

    native?: string;

    taobaoMinigamePlugin?: boolean;

    default?: string[];
}
export interface IBaseItem {
    /**
     * Display text.
     */
    label: string;

    /**
     * Description.
     */
    description?: string;

    required?: boolean;

    native?: string;

    taobaoMinigamePlugin?: boolean;
}

export interface IModuleItem extends IBaseItem {
    /**
     * Display text.
     */
    label: string;

    /**
     * Description.
     */
    description?: string;

    /**
     * Whether if the feature of options allow multiple selection.
     */
    multi?: boolean;

    /**
     * If have default it will checked
     */
    default?: string[];

    options?: Record<string, IBaseItem>;

    category?: string;

    flags?: Record<string, IFlagBaseItem>;
}

export interface IDisplayModuleItem extends IModuleItem {
    _value: boolean;
    _option?: string;
    options?: Record<string, IDisplayModuleItem>;
}

export interface IDisplayModuleCache {
    _value: boolean;
    _option?: string;
    flags?: Record<string, boolean>;
}
