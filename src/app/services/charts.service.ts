// @ts-ignore
import pieChart from '../../assets/charts/pie.json';
import {Injectable} from "@angular/core";
import embed from "vega-embed";

@Injectable()
export class ChartsService {

  drawPieChart(title:string ,element: string, values: {}[], width: number, height:number, colors: string[], options: {}) {
    var pie = JSON.parse(JSON.stringify(pieChart))
    pie["description"] = title
    pie["data"][0]["values"] = values
    pie["width"] = width
    pie["height"] = height
    pie["scales"][0]["range"] = colors
    embed(element, pie, options)

  }
}
