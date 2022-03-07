const userServices = require("./user-services.js");

test('addUser -- Success', async () => {
    const person = {
        username: "TestUser",
        password: "TestPassword",
    }
    const target = await userServices.createUser(person.username,"abc");
    //const result = await userServices.findUserByUsername(target.username);
    //const done = await userServices.deleteUser(target.id);
    await expect(target.username).toStrictEqual("TestUser");
});
test('findUserByUsername(username) -- Success', async () => {
    const testUserName = "TestUser";
    const result = await userServices.findUserByUsername(testUserName);
    const testy = await userServices.findUserById(result[0].id)
    const final = await userServices.getUsers(testUserName);
    expect(result[0].username).toStrictEqual(testUserName);
    //expect(result[0].password).toStrictEqual("TestPassword");
    expect(result[0].coins).toStrictEqual(500);
    expect(result[0].wins).toStrictEqual(0);
    expect(result[0].losses).toStrictEqual(0);
    expect(result[0].friends).toStrictEqual([""]);
    expect(result[0]).toStrictEqual(testy);
    expect(result).toStrictEqual(final);
});
test('updateCoins(username,value) -- Success', async () => {
    const testUserName = "TestUser";
    await userServices.setCoins(testUserName,300);
    await userServices.updateCoins(testUserName,100);
    const resulty = await userServices.findUserByUsername(testUserName);
    expect(resulty[0].coins).toStrictEqual(400);
});
test('win(username,value,win) -- Success', async () => {
    const testUserName = "TestUser";
    await userServices.setCoins(testUserName,500);
    await userServices.win(testUserName,100,false);
    const resulty = await userServices.findUserByUsername(testUserName);
    expect(resulty[0].coins).toStrictEqual(400);
    expect(resulty[0].wins).toStrictEqual(0);
    expect(resulty[0].losses).toStrictEqual(1);
    await userServices.win(testUserName,100,true);
    const result2 = await userServices.findUserByUsername(testUserName);
    expect(result2[0].coins).toStrictEqual(500);
    expect(result2[0].wins).toStrictEqual(1);
    expect(result2[0].losses).toStrictEqual(1);
});
test('deleteUser(id) -- Success', async () => {
    const testUserName = "TestUser";
    const done = await userServices.deleteUser(testUserName);
    await expect(done.deletedCount).toStrictEqual(1);
});