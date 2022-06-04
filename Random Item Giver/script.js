const Settings = {
    //Item Generation Settings
    Maximum_Per_Item_Generate: 4,
    Minimum_Item_List_Length: 30,
    //Properties that will be in the item.
    Passing_Values: ["Item_Name"],
    //Roll Settings (Min, Max)
    Roll_Time: [10, 23],
    Roll_Speed: [20, 30],
}

const Items = [
    {Item_Avaible: true, Must_Included: true, Item_Name: "Stick", Item_Chance: .4},
    {Item_Avaible: true, Must_Included: true, Item_Name: "Stone", Item_Chance: .6},
    {Item_Avaible: true, Must_Included: false, Item_Name: "Gold", Item_Chance: .1},
    {Item_Avaible: true, Must_Included: true, Item_Name: "Leaf", Item_Chance: .5},
]

class Common {
    static Find_Between(min, max) {
        const difference = max - min;
        const random = Math.random();
        return Math.floor(random * difference) + min;
    }
}

class Background {
    //Preparing an item list.
    static Prepare_List = () => {

        //Creates an object model depending on passing values.
        const Create_Object_Model = props => {
            const Model = {};
            Settings.Passing_Values.forEach(item => Model[item] = props[item]);
            return Model;
        }

        //Generates random items depending on their chances.
        const Generate_Random_Items = () => {
            const Random_Items = [];

            Items.forEach(item => {
                let item_counter = 0;
                let item_must_included = item.Must_Included;

                while(item_must_included || item.Item_Chance <= Math.random()) {
                    if (item_counter >= Settings.Maximum_Per_Item_Generate) {break}
                    const Object_Model = Create_Object_Model({...item});
                    Random_Items.push(Object_Model);
                    item_must_included = false;
                    item_counter++;
                }
            })
            return Random_Items;
        }

        const Prepare_List = (array) => {
            if (array.length >= Settings.Minimum_Item_List_Length) {return array;}
            const Generated_Items = Generate_Random_Items();
            Generated_Items.map((item) => {array.push(item)});
            return Prepare_List(array);
        }

        const Switch_Objects = (obj_1, obj_2) => {
            const obj_1_tmp = {...obj_1};
            Settings.Passing_Values.forEach(value =>{
                obj_1[value] = obj_2[value];
                obj_2[value] = obj_1_tmp[value];
            });
        }

        //Shuffling generated list.
        const Shuffle_List = () => {
            const Prepared_List = Prepare_List([]);
            Prepared_List.forEach((item) => {
                const random_index = Math.floor(Math.random() * Prepared_List.length);
                Switch_Objects(item,  Prepared_List[random_index]);
            });
            return Prepared_List;
        }

        return Shuffle_List();
    }

    static Roll_Result(item_list) {
        let roll_time = Common.Find_Between(Settings.Roll_Time[0], Settings.Roll_Time[1])
        let roll_speed = Common.Find_Between(Settings.Roll_Speed[0], Settings.Roll_Speed[1])
        let tiles_passed = 0;
        const speed_his = [];

        const Array_Loop = (array, index) => {
            if (index >= array.length - 1) {return index % (array.length - 1)}
            return ++index;
        }

        speed_his.push(roll_speed);
        speed_his.push(roll_time);

        do {
            roll_speed = roll_speed - (roll_speed / roll_time); 
            tiles_passed += roll_speed, roll_time--;
        }
        while (roll_time > 0)

        return [
            item_list[Array_Loop(item_list, Math.round(tiles_passed))], //item
            Array_Loop(item_list, Math.round(tiles_passed)), //item index
            speed_his //speed history
        ];
    }
}

const item_list = Background.Prepare_List();
const roll_in_list = Background.Roll_Result(item_list);
console.log("Items In:", item_list);
console.log(`Congrats you've won: ${roll_in_list[0].Item_Name}`);