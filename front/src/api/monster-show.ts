import axios from "axios";
import Cookies from "js-cookie";

export type MonsterShowRequest = {
    name: string;
    imageFile: File | null;
    attack: number;
    maxHitPoint: number;
    hitPoint: number;
    experiencePoint: number;
    slash: number;
    blow: number;
    shoot: number;
    neutral: number;
    flame: number;
    water: number;
    wood: number;
    shine: number;
    dark: number;
    weapon: {
        id: number;
        name: string;
    } | null;
    item: {
        id: number;
        name: string;
    } | null;
};


export function monsetrShow(){

}
