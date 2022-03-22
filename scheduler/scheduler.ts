class Recipe {
    name: any;
    time: number;
}

interface Order {
    recipe: Recipe;
    finish: number;
}

type RecipeCompleted = (completed: Recipe) => void;

class Scheduler {
    private readonly orders: Order[] = [];
    private timeoutID: number;

    constructor(private readonly callback: RecipeCompleted) {
        this.load();
    }

    public add(recipe: Recipe): void {
        const order: Order = {
            recipe,
            finish: Date.now() + recipe.time
        };
        this.orders.push(order);
        this.schedule();
    }

    private prepare(order: Order): void {
        this.callback(order.recipe);
        this.orders.splice(0, 1);
        this.schedule();
    }

    private schedule(): void {
        if (this.timeoutID) {
            window.clearTimeout(this.timeoutID);
        }
        this.persist(); // todo schedule method should not responsible for persisting
        if (this.orders.length <= 0) {
            return;
        }
        // todo orders array may sorted by default. Use custom tree like structure
        //  java alternative https://docs.oracle.com/javase/8/docs/api/java/util/TreeMap.html
        this.orders.sort((a, b) => a.finish - b.finish);
        const prepared = this.orders[0];
        const remaining = prepared.finish - Date.now();
        this.timeoutID = window.setTimeout(() => this.prepare(prepared), remaining);
    }

    private persist(): void {
        // todo may use IndexDB
        window.localStorage.setItem('scheduler_orders', JSON.stringify(this.orders));
    }

    private load(): void {
        const value = window.localStorage.getItem('scheduler_orders');
        if (value && value.length > 0) {
            const orders: [] = JSON.parse(value);
            orders.forEach(o => this.orders.push(o))
            this.schedule();
        }
    }
}