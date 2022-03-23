interface Collectable {
    name: string;
}

interface Worth {
    name: string;
    amount: number;
}

class Inventory {

    private readonly LS_PREFIX = 'INVENTORY_';

    public add(collectable: Collectable, amount: number): number {
        let has = this.read(collectable);
        let amountToSave = has + amount;
        return this.write(collectable, amountToSave);
    }

    public remove(collectable: Collectable, amount: number) {
        let has = this.read(collectable);
        let amountToSave = has - amount;
        if (amountToSave < 0) {
            throw Error(`Amount exceeded. Inventory has only ${has} ${collectable.name}(s)`);
        }
        return this.write(collectable, amountToSave);
    }

    public worth() {
        const worth: Worth[] = [];
        Object.entries(window.localStorage)
            .filter(([k]) => k.startsWith(this.LS_PREFIX))
            .forEach(([k, v]) => {
                worth.push({
                    name: k.substring(this.LS_PREFIX.length),
                    amount: Number(v)
                });
            });
        return worth;
    }

    private lsKey(collectable: Collectable) {
        return this.LS_PREFIX + collectable.name;
    }

    private read(collectable: Collectable) {
        let val = window.localStorage.getItem(this.lsKey(collectable));
        return val ? Number(val) : 0;
    }

    private write(collectable: Collectable, value: number) {
        window.localStorage.setItem(this.lsKey(collectable), `${value}`);
        return value;
    }

}

export {Inventory};