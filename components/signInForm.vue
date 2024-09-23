<template>
  <form method="post" accept-charset="UTF-8">
    <div class="mb-6 mt-4">
      <label for="loginName" class="font-bold">Username or email</label>
      <input name="loginName" type="text" class="w-full px-6 py-4" />
    </div>
    <div class="mb-6">
      <label for="password" class="font-bold">Password</label>
      <input name="password" type="password" class="w-full px-6 py-4" />
    </div>
    <input type="submit" class="rounded font-bold bg-red-600 text-slate-50 px-6 py-4" value="Sign in" />
  </form>
  </template>

