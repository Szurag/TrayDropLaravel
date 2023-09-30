<?php declare(strict_types=1);

use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Faker\Factory as Faker;


class RegistrationTest extends TestCase {
    use RefreshDatabase;
    use WithFaker;

    public function test_cant_make_get_request() {
        $response = $this->get('/api/auth/register');

        $response->assertStatus(405);
    }

    public function test_new_user_can_register() {
        $response = $this->post('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password'
        ], [
            'Accept' => 'application/json'
        ]);

        $response->assertStatus(201);
    }

    public function test_bad_email_fails() {
        $response = $this->post('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test',
            'password' => 'password',
            'password_confirmation' => 'password'
        ], [
            'Accept' => 'application/json'
        ]);

        $response->assertStatus(422);
    }

    public function test_bad_password_fails()
    {
        $response = $this->post('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@exmaple.com',
            'password' => 'password',
            'password_confirmation' => 'password2'
        ], [
            'Accept' => 'application/json'
        ]);

        $response->assertStatus(422);
    }

    public function test_email_must_be_unique()
    {
        $email = $this->faker->unique()->safeEmail;

        $response = $this->post('/api/auth/register', [
            'name' => 'Test User',
            'email' => $email,
            'password' => 'password',
            'password_confirmation' => 'password'
        ], [
            'Accept' => 'application/json'
        ]);

        $response->assertStatus(201);

        $response = $this->post('/api/auth/register', [
            'name' => 'Test User',
            'email' => $email,
            'password' => 'password',
            'password_confirmation' => 'password'
        ], [
            'Accept' => 'application/json'
        ]);

        $response->assertStatus(422);
    }

    public function test_password_must_be_confirmed() {
        $faker = Faker::create();

        $response = $this->post('/api/auth/register', [
            'name' => $faker->name,
            'email' => $faker->unique()->safeEmail,
            'password' => 'password',
            'password_confirmation' => 'password2'
        ], [
            'Accept' => 'application/json'
        ]);

        $response->assertStatus(422);

    }

}
