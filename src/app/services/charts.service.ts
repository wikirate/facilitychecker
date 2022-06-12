// @ts-ignore
import pieChart from '../../assets/charts/pie.json';
// @ts-ignore
import barChart from '../../assets/charts/bar.json';
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

  drawBarChart(title:string ,element: string, values: {}[], width: number, height:number, colors: string[], options: {}) {
    var bar = JSON.parse(JSON.stringify(barChart))
    bar["description"] = title
    bar["data"][0]["values"] = values
    bar["width"] = width
    bar["height"] = height
    bar["scales"][2]["range"] = colors
    embed(element, bar, options)
  }
}
