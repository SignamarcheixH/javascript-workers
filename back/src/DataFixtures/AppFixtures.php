<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager)
    {
        $faker = Faker\Factory::create();

        for ($i = 0; $i < 55; $i++) {

            $user = new User();
            $user->setAge($faker->numberBetween(3, 90));
            $user->setBio($faker->text(mt_rand(30, 150)));
            $user->setCity($faker->streetAddress);
            $user->setName($faker->name);
            $manager->persist($user);

            $manager->flush();
        }
    }
}
