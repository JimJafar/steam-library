export default function polyFillSchedulerYield() {
  (<any>globalThis).scheduler = (<any>globalThis).scheduler || {};
  (<any>globalThis).scheduler.yield =
    (<any>globalThis).scheduler.yield ||
    (() =>
      new Promise((r) => {
        setTimeout(r, 0);
      }));
}
