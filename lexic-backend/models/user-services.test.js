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
test('win(uuid,win) -- Success', async () => {
    const testUser = "5b21f7e0-dc09-4073-81ba-89f25cf19833";
    const usr = await userServices.findUserByUid(testUser);
    const origCoins = usr.coins;
    const origWins = usr.wins;
    const origLoss = usr.losses;
    await userServices.win(testUser, false);
    const resulty = await userServices.findUserByUid(testUser);
    expect(resulty.coins).toStrictEqual(origCoins - 50);
    expect(resulty.wins).toStrictEqual(origWins);
    expect(resulty.losses).toStrictEqual(origLoss + 1);
    await userServices.win(testUser,true);
    const result2 = await userServices.findUserByUid(testUser);
    expect(result2.coins).toStrictEqual(origCoins);
    expect(result2.wins).toStrictEqual(origWins + 1);
    expect(result2.losses).toStrictEqual(resulty.losses);
});
test('deleteUser(id) -- Success', async () => {
    const testUserName = "TestUser";
    const done = await userServices.deleteUser(testUserName);
    await expect(done.deletedCount).toStrictEqual(1);
});
test('test return users list -- Success', async () => {
    const testy = await userServices.getUsers();
    await expect(testy.length).toBeGreaterThan(1);
});
